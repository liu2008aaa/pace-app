/**
 * RouteMap · 跑步路线小地图
 *
 * Phone 04 结束页的 86px 高小地图，纯 SVG 手绘。
 * 风格：极淡 grid + 4 条街道 + 一条优雅曲线路线 + 起点空心环 + 终点实心光晕点。
 *
 * v0.3 是静态版本。粒子动画 (animateMotion) 推迟到 v0.4 Phone 16 路线详情。
 *
 * Props:
 *   - title: 顶左小字 "ROUTE · 5.42 KM"
 *   - geo: 顶右经纬度 "31.2°N · 121.4°E"
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Pattern,
  Path,
  Rect,
  Circle,
  Line,
  G,
} from 'react-native-svg';
import { colors, fonts } from '@/src/theme';

interface Props {
  title?: string;
  geo?: string;
  height?: number;
}

export function RouteMap({
  title = 'ROUTE · 5.42 KM',
  geo = '31.2°N · 121.4°E',
  height = 86,
}: Props) {
  return (
    <View style={[styles.wrap, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 280 86" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity={0.4} />
            <Stop offset="50%" stopColor={colors.accent} stopOpacity={1} />
            <Stop offset="100%" stopColor={colors.accentBright} stopOpacity={0.95} />
          </LinearGradient>
          <Pattern id="mapGrid" width={20} height={20} patternUnits="userSpaceOnUse">
            <Path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(255,255,255,0.025)"
              strokeWidth={0.5}
            />
          </Pattern>
        </Defs>

        {/* 网格底纹 */}
        <Rect width={280} height={86} fill="url(#mapGrid)" />

        {/* 主要街道 */}
        <Line x1={0} y1={30} x2={280} y2={30} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        <Line x1={0} y1={60} x2={280} y2={60} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        <Line x1={80} y1={0} x2={80} y2={86} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        <Line x1={200} y1={0} x2={200} y2={86} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />

        {/* 路线 shadow */}
        <Path
          d="M 30 65 C 50 67, 70 46, 90 44 S 130 56, 150 46 S 200 26, 230 30 S 258 46, 254 60"
          fill="none"
          stroke={colors.accent}
          strokeOpacity={0.15}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* 路线主线（渐变） */}
        <Path
          d="M 30 65 C 50 67, 70 46, 90 44 S 130 56, 150 46 S 200 26, 230 30 S 258 46, 254 60"
          fill="none"
          stroke="url(#routeGrad)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* 起点：空心环 */}
        <Circle cx={30} cy={65} r={5} fill="none" stroke={colors.accent} strokeWidth={1.5} />
        <Circle cx={30} cy={65} r={1.5} fill={colors.accent} />

        {/* 终点：实心冷绿 + 光晕 */}
        <Circle cx={254} cy={60} r={4} fill={colors.accentBright} />
        <Circle
          cx={254}
          cy={60}
          r={9}
          fill="none"
          stroke={colors.accentBright}
          strokeOpacity={0.4}
          strokeWidth={0.5}
        />
      </Svg>

      {/* 顶部叠层标签 */}
      <Text style={styles.titleTopLeft}>{title}</Text>
      <View style={styles.geoTopRight}>
        <View style={styles.geoDot} />
        <Text style={styles.geoText}>{geo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: colors.hairline,
    backgroundColor: '#050708',
    position: 'relative',
  },
  titleTopLeft: {
    position: 'absolute',
    top: 6,
    left: 8,
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.text3,
    letterSpacing: 2.4,
  },
  geoTopRight: {
    position: 'absolute',
    top: 6,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  geoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.7,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
  },
  geoText: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.text3,
    letterSpacing: 1.4,
  },
});
