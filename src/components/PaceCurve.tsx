/**
 * PaceCurve · 配速曲线
 *
 * Phone 04 中部的 5-公里分段配速折线。
 * - 5 个数据点连成折线 + 渐变填充下方
 * - X 轴标签 1 2 3 4 5
 * - 最后一个点高亮（实心冷绿 + 光晕环）= 末公里冲刺
 *
 * Props:
 *   - splits: 5 个秒数（理论上长度 5）
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Line,
  Circle,
  Text as SvgText,
} from 'react-native-svg';
import { colors, fonts } from '@/src/theme';
import { formatPace } from '@/src/lib/format';

interface Props {
  splits: number[];
}

const VIEW_W = 280;
const VIEW_H = 64;
const PAD_LEFT = 14;
const PAD_RIGHT = 14;
const PAD_TOP = 12;
const PAD_BOTTOM = 14;
const POINT_W = VIEW_W - PAD_LEFT - PAD_RIGHT;
const POINT_H = VIEW_H - PAD_TOP - PAD_BOTTOM;

export function PaceCurve({ splits }: Props) {
  if (splits.length === 0) {
    return null;
  }

  // 找出 min/max 配速以归一化
  const min = Math.min(...splits);
  const max = Math.max(...splits);
  const range = max - min || 1;

  // 计算每个点的 (x, y) 坐标。配速越小（更快） → y 越小（顶部）
  const points = splits.map((pace, i) => {
    const x = PAD_LEFT + (i / (splits.length - 1)) * POINT_W;
    const norm = (pace - min) / range;
    const y = PAD_TOP + norm * POINT_H;
    return { x, y, pace };
  });

  // 构造折线路径
  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  // 构造下方填充（折线 + 右下 + 左下闭合）
  const fillPath =
    linePath +
    ` L ${points[points.length - 1].x} ${VIEW_H - PAD_BOTTOM}` +
    ` L ${points[0].x} ${VIEW_H - PAD_BOTTOM} Z`;

  const lastIndex = points.length - 1;

  // 末公里 vs 首公里差值（秒）
  const delta = splits[0] - splits[lastIndex]; // 正数 = 加速了

  return (
    <View style={styles.wrap}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>每公里配速</Text>
        {delta > 0 && (
          <Text style={styles.headerDelta}>↓ 末公里 -{Math.round(delta)}s</Text>
        )}
      </View>

      <Svg width="100%" height={VIEW_H} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
        <Defs>
          <LinearGradient id="paceFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity={0.35} />
            <Stop offset="100%" stopColor={colors.accent} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* 横向参考线 */}
        <Line
          x1={0}
          y1={PAD_TOP + POINT_H * 0.25}
          x2={VIEW_W}
          y2={PAD_TOP + POINT_H * 0.25}
          stroke="rgba(255,255,255,0.04)"
          strokeDasharray="2 4"
        />
        <Line
          x1={0}
          y1={PAD_TOP + POINT_H * 0.5}
          x2={VIEW_W}
          y2={PAD_TOP + POINT_H * 0.5}
          stroke="rgba(255,255,255,0.04)"
          strokeDasharray="2 4"
        />
        <Line
          x1={0}
          y1={PAD_TOP + POINT_H * 0.75}
          x2={VIEW_W}
          y2={PAD_TOP + POINT_H * 0.75}
          stroke="rgba(255,255,255,0.04)"
          strokeDasharray="2 4"
        />

        {/* 渐变填充 */}
        <Path d={fillPath} fill="url(#paceFill)" />
        {/* 折线 */}
        <Path
          d={linePath}
          fill="none"
          stroke={colors.accent}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {points.map((p, i) => {
          const isLast = i === lastIndex;
          if (isLast) {
            return (
              <React.Fragment key={i}>
                <Circle cx={p.x} cy={p.y} r={3.5} fill={colors.accent} />
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={6}
                  fill="none"
                  stroke={colors.accent}
                  strokeOpacity={0.3}
                />
              </React.Fragment>
            );
          }
          return (
            <Circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill={colors.bgCard}
              stroke={colors.accent}
              strokeWidth={1.2}
            />
          );
        })}

        {/* X 轴标签 */}
        {points.map((p, i) => {
          const isLast = i === lastIndex;
          return (
            <SvgText
              key={`label-${i}`}
              x={p.x}
              y={VIEW_H - 1}
              fontFamily={fonts.mono}
              fontSize={7}
              fill={isLast ? colors.accent : colors.text3}
              textAnchor="middle"
            >
              {i + 1}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLabel: {
    fontFamily: fonts.cn,
    fontSize: 9,
    color: colors.text3,
    letterSpacing: 2,
  },
  headerDelta: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 0.5,
  },
});
