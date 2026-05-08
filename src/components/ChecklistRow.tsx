/**
 * ChecklistRow · 检查清单单行
 *
 * Phone 02 跑前预热的「系统就绪」清单。
 * 三种状态：
 *   - ok: ✓ 冷绿
 *   - warn: ! 金色（音乐未检测、GPS 信号弱等）
 *   - searching: ◌ 旋转 spinner
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, fonts } from '@/src/theme';

type Status = 'ok' | 'warn' | 'searching';

interface Props {
  status: Status;
  label: string;     // 中文主标签 "GPS"
  detail: string;    // 右侧详情 "已锁定 12 颗卫星"
}

export function ChecklistRow({ status, label, detail }: Props) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (status === 'searching') {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [status]);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const rowStyle =
    status === 'ok'
      ? styles.rowOk
      : status === 'warn'
      ? styles.rowWarn
      : styles.rowSearching;

  return (
    <View style={[styles.row, rowStyle]}>
      {/* Indicator */}
      {status === 'ok' && (
        <View style={[styles.iconCircle, styles.iconOk]}>
          <Text style={styles.iconCheck}>✓</Text>
        </View>
      )}
      {status === 'warn' && (
        <View style={[styles.iconCircle, styles.iconWarn]}>
          <Text style={styles.iconWarnText}>!</Text>
        </View>
      )}
      {status === 'searching' && (
        <Animated.View style={[styles.spinnerRing, spinnerStyle]} />
      )}

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Detail (right-aligned) */}
      <Text
        style={[
          styles.detail,
          status === 'warn' && styles.detailWarn,
          status === 'searching' && styles.detailSearching,
        ]}
      >
        {detail}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 6,
  },
  rowOk: {
    backgroundColor: 'rgba(0, 229, 168, 0.04)',
    borderColor: 'rgba(0, 229, 168, 0.25)',
  },
  rowWarn: {
    backgroundColor: 'rgba(229, 192, 123, 0.03)',
    borderColor: 'rgba(229, 192, 123, 0.22)',
  },
  rowSearching: {
    backgroundColor: 'rgba(229, 192, 123, 0.04)',
    borderColor: 'rgba(229, 192, 123, 0.32)',
  },

  iconCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOk: {
    backgroundColor: colors.accent,
  },
  iconCheck: {
    color: '#001A14',
    fontSize: 9,
    fontWeight: fonts.weights.extrabold,
    lineHeight: 10,
  },
  iconWarn: {
    backgroundColor: colors.gold,
  },
  iconWarnText: {
    color: '#2A1F00',
    fontSize: 9,
    fontWeight: fonts.weights.extrabold,
    lineHeight: 10,
  },

  spinnerRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderTopColor: 'transparent',
  },

  label: {
    flex: 1,
    fontFamily: fonts.cn,
    fontSize: 11,
    color: colors.text1,
  },
  detail: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.text2,
    letterSpacing: 0.7,
  },
  detailWarn: {
    color: colors.gold,
  },
  detailSearching: {
    color: colors.gold,
  },
});
