/**
 * HRDonut · 心率区间环 + Legend
 *
 * Phone 04 底部那个心率区间饼图。
 * 5 个分段不同明度的环弧 + 中间显示平均 BPM。
 * 右侧是 Z1-Z5 legend，每个 zone 含色块/标签/时长/百分比。
 *
 * v0.3 数据写死（与 HTML demo 一致），后续根据真实 HR 时间序列计算。
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@/src/theme';

interface ZoneEntry {
  zone: string;       // "Z1" - "Z5"
  color: string;      // 边框色块色
  swatchAlpha: number;
  duration: string;   // "11:50"
  percent: number;    // 0-100
  highlighted?: boolean; // active zone (Z3)
}

interface Props {
  avgBPM: number;
  zones?: ZoneEntry[];
}

const RING_R = 26;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

const DEFAULT_ZONES: ZoneEntry[] = [
  { zone: 'Z1', color: 'rgba(255,255,255,0.18)', swatchAlpha: 0.18, duration: '2:14', percent: 8 },
  { zone: 'Z2', color: 'rgba(0,229,168,0.32)', swatchAlpha: 0.32, duration: '5:08', percent: 18 },
  { zone: 'Z3', color: 'rgba(0,229,168,0.7)', swatchAlpha: 0.7, duration: '11:50', percent: 42, highlighted: true },
  { zone: 'Z4', color: 'rgba(255,200,100,0.7)', swatchAlpha: 0.7, duration: '6:48', percent: 24 },
  { zone: 'Z5', color: 'rgba(255,107,61,0.85)', swatchAlpha: 0.85, duration: '2:14', percent: 8 },
];

export function HRDonut({ avgBPM, zones = DEFAULT_ZONES }: Props) {
  // 把 percent 转成 dasharray 弧长 + 累积 dashoffset
  let cursor = 0;
  const arcs = zones.map((z) => {
    const arcLen = (z.percent / 100) * CIRCUMFERENCE;
    const restLen = CIRCUMFERENCE - arcLen;
    const offset = -cursor;
    cursor += arcLen;
    return {
      ...z,
      arcLen,
      restLen,
      offset,
    };
  });

  return (
    <View style={styles.wrap}>
      {/* 左：环图 */}
      <Svg width={64} height={64} viewBox="0 0 64 64">
        {/* 背景圈 */}
        <Circle
          cx={32}
          cy={32}
          r={RING_R}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={6}
        />

        {/* 5 段分弧 */}
        {arcs.map((a, i) => (
          <Circle
            key={i}
            cx={32}
            cy={32}
            r={RING_R}
            fill="none"
            stroke={a.color}
            strokeWidth={6}
            strokeDasharray={`${a.arcLen} ${a.restLen}`}
            strokeDashoffset={a.offset}
            transform="rotate(-90 32 32)"
          />
        ))}

        <SvgText
          x={32}
          y={33}
          fontFamily={fonts.mono}
          fontSize={13}
          fontWeight="600"
          fill="#fff"
          textAnchor="middle"
        >
          {avgBPM}
        </SvgText>
        <SvgText
          x={32}
          y={44}
          fontFamily={fonts.mono}
          fontSize={6}
          fill={colors.text3}
          textAnchor="middle"
          letterSpacing="0.6"
        >
          AVG BPM
        </SvgText>
      </Svg>

      {/* 右：Legend 列表 */}
      <View style={styles.legend}>
        {zones.map((z) => (
          <View key={z.zone} style={styles.legendRow}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: z.color },
              ]}
            />
            <Text
              style={[
                styles.zoneLabel,
                z.highlighted && styles.zoneLabelHi,
              ]}
            >
              {z.zone}
            </Text>
            <Text
              style={[
                styles.duration,
                z.highlighted && styles.durationHi,
              ]}
            >
              {z.duration}
            </Text>
            <Text
              style={[
                styles.percent,
                z.highlighted && styles.percentHi,
              ]}
            >
              {z.percent}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legend: {
    flex: 1,
    gap: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  swatch: {
    width: 7,
    height: 7,
    borderRadius: 1.5,
  },
  zoneLabel: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.text2,
    width: 14,
  },
  zoneLabelHi: {
    color: colors.accent,
    fontWeight: fonts.weights.semibold,
  },
  duration: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.text3,
  },
  durationHi: {
    color: colors.text2,
  },
  percent: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.text4,
    marginLeft: 'auto',
  },
  percentHi: {
    color: colors.accent,
    fontWeight: fonts.weights.semibold,
  },
});
