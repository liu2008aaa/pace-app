/**
 * PhoneStatusBar · 仿 iOS 状态栏（demo 用）
 *
 * 注意：真机上 iOS 自身就有真正的状态栏，这个组件主要用于：
 * (a) 设计稿对照（保持和 HTML demo 一致的视觉）
 * (b) 在 simulator / dev 阶段显示假数据
 * 上线时如果走 SafeAreaView，可以隐藏此组件，让真实状态栏显示。
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { colors, fonts } from '@/src/theme';

interface Props {
  /** 显示时间，e.g. "9:41" */
  time?: string;
  /** 信号强度 0-4 */
  signal?: number;
  /** 电量 0-100 */
  battery?: number;
}

export function PhoneStatusBar({
  time = '9:41',
  signal = 4,
  battery = 87,
}: Props) {
  const batteryFillWidth = Math.max(2, (battery / 100) * 15);

  return (
    <View style={styles.bar}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.icons}>
        {/* 信号 */}
        <Svg width={16} height={11} viewBox="0 0 16 11">
          {[0, 1, 2, 3].map((i) => (
            <Rect
              key={i}
              x={i * 4}
              y={7 - i * 2}
              width={3}
              height={4 + i * 2}
              rx={0.5}
              fill="white"
              fillOpacity={signal > i ? 1 : 0.45}
            />
          ))}
        </Svg>
        {/* WiFi (simplified arc) */}
        <Svg width={14} height={10} viewBox="0 0 14 10">
          <Path d="M7 9.5 L8.4 8 L7 6.5 L5.6 8 Z" fill="white" />
          <Path
            d="M7 7 C5.5 7 4.4 7.7 3.7 8.5 L4.6 9.4 C5.2 8.8 6 8.4 7 8.4 C8 8.4 8.8 8.8 9.4 9.4 L10.3 8.5 C9.6 7.7 8.5 7 7 7 Z"
            fill="white"
          />
          <Path
            d="M7 4 C4.5 4 2.5 5 1 6.5 L1.9 7.4 C3.2 6.1 4.9 5.4 7 5.4 C9.1 5.4 10.8 6.1 12.1 7.4 L13 6.5 C11.5 5 9.5 4 7 4 Z"
            fill="white"
            fillOpacity={0.95}
          />
        </Svg>
        {/* 电池 */}
        <Svg width={24} height={10} viewBox="0 0 24 10">
          <Rect
            x={0.5}
            y={0.5}
            width={19}
            height={9}
            rx={2}
            fill="none"
            stroke="white"
            strokeOpacity={0.5}
          />
          <Rect x={2} y={2} width={batteryFillWidth} height={6} rx={1} fill="white" />
          <Rect x={20} y={3.5} width={1.5} height={3} rx={0.5} fill="white" fillOpacity={0.55} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 50,
    paddingHorizontal: 28,
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    color: colors.text1,
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: fonts.weights.semibold,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
