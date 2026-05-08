/**
 * DialCard · WHOOP 风三联表盘单个 dial
 *
 * Phone 01 / Phone 13 用。环形进度 + 中央数字 + 标签 + 元信息。
 * 支持 3 种状态：good (冷绿) / warn (金) / empty (虚线灰)。
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode } from 'react-native-svg';
import { colors, fonts } from '@/src/theme';

type DialState = 'good' | 'warn' | 'empty';

interface Props {
  /** 角标编号 01 / 02 / 03 */
  cornerMark: string;
  /** 中央显示的值（数字、百分比、空态显示 — ） */
  value: string | number;
  /** 中央副标，如 /100, /21, 7h 24m */
  unit: string;
  /** 主标签：状态 / 负荷 / 睡眠 */
  label: string;
  /** 元信息：↑ 6 vs 昨 / 7 日 · 偏高 */
  meta: string;
  /** 进度百分比 0-100，empty 状态忽略 */
  percent?: number;
  /** 状态决定颜色 */
  state: DialState;
  /** 点击事件（导航到详情页） */
  onPress?: () => void;
}

const RING_RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ≈ 163.36

export function DialCard({
  cornerMark,
  value,
  unit,
  label,
  meta,
  percent = 0,
  state,
  onPress,
}: Props) {
  const isEmpty = state === 'empty';
  const isWarn = state === 'warn';

  const ringColor = isEmpty ? colors.text4 : isWarn ? colors.gold : colors.accent;
  const metaColor = isEmpty ? colors.text3 : isWarn ? colors.gold : colors.accent;
  const valueColor = isEmpty ? colors.text4 : colors.text1;

  // 用 strokeDashoffset 实现进度环
  // empty 状态干脆不画进度，只画虚线背景圈
  const dashOffset = isEmpty ? 0 : CIRCUMFERENCE * (1 - percent / 100);

  const cardBgStyle =
    state === 'warn'
      ? styles.cardWarn
      : state === 'empty'
      ? styles.cardEmpty
      : styles.cardDefault;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        cardBgStyle,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      {/* 角标 */}
      <Text style={styles.cornerMark}>{cornerMark}</Text>

      {/* SVG 环 */}
      <Svg width={64} height={64} viewBox="0 0 64 64">
        <Defs>
          <Filter id="ringGlow">
            <FeGaussianBlur stdDeviation="2" />
          </Filter>
        </Defs>

        {/* 背景圈 */}
        <Circle
          cx={32}
          cy={32}
          r={RING_RADIUS}
          stroke={
            isEmpty
              ? 'rgba(255,255,255,0.06)'
              : isWarn
              ? 'rgba(229,192,123,0.08)'
              : 'rgba(0,229,168,0.08)'
          }
          strokeWidth={isEmpty ? 2.5 : 3}
          strokeDasharray={isEmpty ? '3,4' : undefined}
          fill="none"
        />

        {/* 进度圈（旋转 -90° 让起点在 12 点方向） */}
        {!isEmpty && (
          <Circle
            cx={32}
            cy={32}
            r={RING_RADIUS}
            stroke={ringColor}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            fill="none"
            transform="rotate(-90 32 32)"
          />
        )}
      </Svg>

      {/* 中央数字（绝对定位覆盖 svg 中心） */}
      <View style={styles.centerContent}>
        <Text style={[styles.valueText, { color: valueColor }]} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.unitText}>{unit}</Text>
      </View>

      {/* 标签 */}
      <Text style={styles.label}>{label}</Text>
      {/* 元信息 */}
      <Text style={[styles.meta, { color: metaColor }]} numberOfLines={1}>
        {meta}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 9,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    position: 'relative',
  },
  cardDefault: {
    backgroundColor: colors.bgCard,
    borderColor: colors.hairline,
  },
  cardWarn: {
    backgroundColor: 'rgba(229,192,123,0.04)',
    borderColor: 'rgba(229,192,123,0.22)',
  },
  cardEmpty: {
    backgroundColor: 'rgba(255,255,255,0.012)',
    borderColor: colors.hairlineBright,
    borderStyle: 'dashed',
  },
  cardPressed: {
    opacity: 0.7,
  },
  cornerMark: {
    position: 'absolute',
    top: 5,
    left: 6,
    fontFamily: fonts.mono,
    fontSize: 6.5,
    color: colors.text4,
    letterSpacing: 1.3,
  },
  centerContent: {
    position: 'absolute',
    top: 17,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  valueText: {
    fontFamily: fonts.mono,
    fontSize: 17,
    fontWeight: fonts.weights.semibold,
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  unitText: {
    fontFamily: fonts.mono,
    fontSize: 6,
    color: colors.text3,
    marginTop: 1,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.text2,
    letterSpacing: 2,
    marginTop: 5,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 8,
    marginTop: 3,
    letterSpacing: 0.4,
  },
});
