/**
 * CountdownRing · 倒计时圆环
 *
 * Phone 02 中央巨大数字 3 → 2 → 1 → 出发。
 * 每秒触觉反馈（轻），最后一秒重击。
 *
 * Props:
 *   - seconds: 起始秒数（通常 3）
 *   - onComplete: 倒数完成回调
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors, fonts } from '@/src/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  seconds: number;
  onComplete: () => void;
  size?: number;
}

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CountdownRing({ seconds, onComplete, size = 132 }: Props) {
  const [current, setCurrent] = useState(seconds);
  const [isGo, setIsGo] = useState(false);

  // 进度环：每秒 360° 转一圈
  const progress = useSharedValue(0);

  useEffect(() => {
    if (current <= 0) {
      // 已完成
      return;
    }

    // 触觉反馈
    if (current === 1) {
      // 最后一秒重击
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    // 进度环 1 秒动画从 0 到 1
    progress.value = 0;
    progress.value = withTiming(1, { duration: 1000, easing: Easing.linear });

    const timer = setTimeout(() => {
      const next = current - 1;
      if (next === 0) {
        // 显示 "出发" 0.6 秒后真正 onComplete
        setIsGo(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setTimeout(() => onComplete(), 600);
      } else {
        setCurrent(next);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [current]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="countGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.accent} />
            <Stop offset="100%" stopColor={colors.accentBright} />
          </LinearGradient>
        </Defs>
        {/* 背景圈 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={2}
          fill="none"
        />
        {/* 进度圈（从 12 点方向开始） */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS}
          stroke="url(#countGrad)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          animatedProps={animatedProps}
        />
        {/* 极淡外圈装饰 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={RADIUS + 4}
          stroke="rgba(0, 229, 168, 0.08)"
          strokeWidth={0.5}
          strokeDasharray="2 4"
          fill="none"
        />
      </Svg>

      {/* 中央数字 / 出发 */}
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.number, isGo && styles.go]}>
          {isGo ? '出发' : current}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontFamily: fonts.mono,
    fontSize: 56,
    fontWeight: fonts.weights.semibold,
    color: '#fff',
    letterSpacing: -2,
  },
  go: {
    fontFamily: fonts.cn,
    fontSize: 36,
    fontWeight: fonts.weights.bold,
    color: colors.accentBright,
    letterSpacing: 6,
    paddingLeft: 6,
    textShadowColor: 'rgba(0,229,168,0.6)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
});
