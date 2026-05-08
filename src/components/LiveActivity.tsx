/**
 * LiveActivity · 模拟灵动岛 LIVE 胶囊
 *
 * 注：真实的 iOS 灵动岛只能通过 ActivityKit 控制（需要 EAS Build + 原生扩展），
 * Expo Go 内无法访问。这里在屏幕顶部画一个模拟的 pill 占位，
 * 让设计意图在开发期可见。
 *
 * 状态：
 *   - running: 红色脉冲点 + 距离 + 配速（冷绿）
 *   - paused: 金色稳定点 + "已暂停" + 时长
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts } from '@/src/theme';

interface Props {
  /** 状态：running 显示红点 + 数据 / paused 显示金点 + 已暂停 */
  mode: 'running' | 'paused';
  /** running 时显示的距离（如 "3.42 km"） */
  distance?: string;
  /** running 时显示的配速（如 "5'24""） */
  pace?: string;
  /** paused 时显示的总时长（如 "18:32"） */
  duration?: string;
}

export function LiveActivity({
  mode,
  distance = '',
  pace = '',
  duration = '',
}: Props) {
  const dotOpacity = useSharedValue(1);
  const dotScale = useSharedValue(1);

  useEffect(() => {
    if (mode === 'running') {
      dotOpacity.value = withRepeat(
        withSequence(
          withTiming(0.45, { duration: 750 }),
          withTiming(1, { duration: 750 })
        ),
        -1,
        false
      );
      dotScale.value = withRepeat(
        withSequence(
          withTiming(0.82, { duration: 750 }),
          withTiming(1, { duration: 750 })
        ),
        -1,
        false
      );
    } else {
      dotOpacity.value = withTiming(1, { duration: 200 });
      dotScale.value = withTiming(1, { duration: 200 });
    }
  }, [mode]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [{ scale: dotScale.value }],
  }));

  return (
    <View style={styles.island}>
      <View style={styles.left}>
        <Animated.View
          style={[
            styles.dot,
            mode === 'running' ? styles.dotLive : styles.dotPaused,
            dotStyle,
          ]}
        />
        {mode === 'running' ? (
          <>
            <Text style={styles.distance}>{distance}</Text>
          </>
        ) : (
          <Text style={styles.pausedLabel}>已暂停</Text>
        )}
      </View>

      <Text
        style={
          mode === 'running' ? styles.paceRight : styles.durationRight
        }
      >
        {mode === 'running' ? pace : duration}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  island: {
    position: 'absolute',
    top: 11,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 28,
    paddingHorizontal: 14,
    minWidth: 188,
    backgroundColor: '#000',
    borderRadius: 14,
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotLive: {
    backgroundColor: colors.live,
    shadowColor: colors.live,
    shadowOpacity: 0.65,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  dotPaused: {
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  distance: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: '#fff',
  },
  pausedLabel: {
    fontFamily: fonts.cn,
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.gold,
    letterSpacing: 1.4,
  },
  paceRight: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.accent,
    textShadowColor: 'rgba(0,229,168,0.5)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  durationRight: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: fonts.weights.semibold,
    color: colors.text2,
  },
});
