/**
 * PaceHuge · 巨型配速数字
 *
 * Phone 03 跑步进行中的中央焦点。
 * 84pt mono，冷绿，4.2 秒呼吸光晕。
 *
 * Props:
 *   - text: 显示文本，例如 "5'24""
 *   - paused: 暂停状态时变灰禁用光晕
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, fonts } from '@/src/theme';

interface Props {
  text: string;
  paused?: boolean;
}

export function PaceHuge({ text, paused = false }: Props) {
  const glow = useSharedValue(0);

  useEffect(() => {
    if (paused) {
      glow.value = withTiming(0, { duration: 400 });
      return;
    }
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2100, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2100, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [paused]);

  const animatedStyle = useAnimatedStyle(() => ({
    textShadowRadius: 22 + glow.value * 8,
    // RN 不支持 textShadowOpacity, 通过 textShadowColor 的 alpha 模拟
    textShadowColor: paused
      ? 'transparent'
      : `rgba(0, 229, 168, ${0.55 + glow.value * 0.17})`,
  }));

  return (
    <View style={styles.wrap}>
      <Animated.Text
        style={[
          styles.number,
          paused && styles.numberPaused,
          animatedStyle,
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  number: {
    fontFamily: fonts.mono,
    fontSize: 84,
    fontWeight: fonts.weights.semibold,
    color: colors.accent,
    letterSpacing: -3,
    lineHeight: 84,
    textShadowOffset: { width: 0, height: 0 },
  },
  numberPaused: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 56, // 暂停时缩小，让 UI 重心转移到按钮
    fontWeight: fonts.weights.semibold,
  },
});
