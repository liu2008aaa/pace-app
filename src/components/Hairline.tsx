/**
 * Hairline · 极细分隔线
 *
 * 0.5px 渐变 hairline，左右淡出。整个 App 反复用。
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/src/theme';

interface Props {
  marginVertical?: number;
}

export function Hairline({ marginVertical = 0 }: Props) {
  return (
    <View style={[styles.row, { marginVertical }]}>
      <View style={styles.fadeLeft} />
      <View style={styles.center} />
      <View style={styles.fadeRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 0.5,
    flexDirection: 'row',
    width: '100%',
  },
  fadeLeft: {
    flex: 1,
    backgroundColor: 'transparent',
    // 真正的 linear-gradient 在 RN 需要 expo-linear-gradient，第一版用 3 段近似
  },
  center: {
    flex: 2,
    backgroundColor: colors.hairlineBright,
  },
  fadeRight: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
