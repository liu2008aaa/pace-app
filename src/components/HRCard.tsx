/**
 * HRCard · 心率卡片
 *
 * Phone 03 底部「心率 152 BPM」卡片。
 * 左：跳动的红心 + "心率" 标签
 * 右：BPM 大数字
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeartIcon } from './HeartIcon';
import { colors, fonts } from '@/src/theme';

interface Props {
  bpm: number;
  paused?: boolean;
}

export function HRCard({ bpm, paused = false }: Props) {
  return (
    <View style={[styles.card, paused && styles.cardPaused]}>
      {/* 左：图标 + 标签 */}
      <View style={styles.left}>
        <HeartIcon size={14} />
        <Text style={styles.label}>心率</Text>
      </View>

      {/* 右：BPM */}
      <View style={styles.right}>
        <Text style={styles.bpm}>{bpm > 0 ? bpm : '—'}</Text>
        <Text style={styles.unit}>BPM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.hairline,
  },
  cardPaused: {
    opacity: 0.6,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontFamily: fonts.cn,
    fontSize: 11,
    letterSpacing: 1.3,
    color: colors.text2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  bpm: {
    fontFamily: fonts.mono,
    fontSize: 22,
    fontWeight: fonts.weights.semibold,
    color: '#fff',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  unit: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.text3,
    letterSpacing: 1.8,
  },
});
