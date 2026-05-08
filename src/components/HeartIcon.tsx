/**
 * HeartIcon · 跳动的心形图标
 *
 * 1.1 秒一次 lub-dub 双拍。粉红色 #FF3B5C，专属符号色。
 * Phone 03 心率卡片用。
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/src/theme';

interface Props {
  size?: number;
}

export function HeartIcon({ size = 14 }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    // lub-dub: 0% (1) → 14% (1.18) → 28% (1) → 42% (1.06) → 75% (1) → 100% (1)
    // 简化为 4 段
    scale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 154, easing: Easing.out(Easing.quad) }),  // 0→14% of 1100ms
        withTiming(1, { duration: 154, easing: Easing.in(Easing.quad) }),       // 14→28%
        withTiming(1.06, { duration: 154, easing: Easing.out(Easing.quad) }),   // 28→42%
        withTiming(1, { duration: 363, easing: Easing.in(Easing.quad) }),       // 42→75%
        withTiming(1, { duration: 275 })                                          // 75→100%
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, animatedStyle, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 14 13">
        <Path
          d="M7 12 C2 9 0.5 6 0.5 3.5 C0.5 1.5 2 0.5 3.5 0.5 C5 0.5 6.5 1.5 7 3 C7.5 1.5 9 0.5 10.5 0.5 C12 0.5 13.5 1.5 13.5 3.5 C13.5 6 12 9 7 12Z"
          fill={colors.heart}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.heart,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
