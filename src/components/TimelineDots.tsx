/**
 * TimelineDots · 14 天活力点
 *
 * Phone 01 待机首页底部那条点状时间线。
 * 13 个历史点（按强度发光）+ 1 个空心今日环（冷绿描边）。
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/src/theme';

interface Props {
  /** 13 个历史日的强度值 0-1（每个点的明亮程度） */
  intensities: readonly number[];
}

export function TimelineDots({ intensities }: Props) {
  return (
    <View style={styles.row}>
      {intensities.map((intensity, i) => {
        // 越远越暗（同时强度也影响亮度）
        const age = (intensities.length - i) / intensities.length; // 1 → 0
        const opacity = Math.min(0.18 + (1 - age) * 0.8 * intensity, 0.9);
        // 强度高的点稍大一些
        const size = 4 + Math.round(intensity * 4); // 4-8 px
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: `rgba(0, 229, 168, ${opacity})`,
                shadowColor: colors.accent,
                shadowOpacity: intensity > 0.7 ? 0.5 : 0,
                shadowRadius: intensity > 0.7 ? 4 : 0,
              },
            ]}
          />
        );
      })}
      {/* 今日空心环 */}
      <View style={styles.today} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  dot: {
    backgroundColor: colors.text4,
  },
  today: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
});
