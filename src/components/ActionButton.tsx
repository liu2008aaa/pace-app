/**
 * ActionButton · 大动作按钮（继续 / 结束）
 *
 * Phone 12 暂停状态底部的两颗大胶囊。
 * - continue: 冷绿物理质感 + ▶ 图标 + "继续 / CONTINUE"
 * - end: 暗红物理质感 + ■ 图标 + "结束 / END"
 *
 * Props:
 *   - variant: 'continue' | 'end'
 *   - onPress
 */

import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts, easings } from '@/src/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  variant: 'continue' | 'end';
  onPress: () => void;
}

export function ActionButton({ variant, onPress }: Props) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 120, easing: easings.out });
    Haptics.impactAsync(
      variant === 'continue'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Heavy
    ).catch(() => {});
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200, easing: easings.out });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isContinue = variant === 'continue';

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.btn,
        isContinue ? styles.btnContinue : styles.btnEnd,
        animatedStyle,
      ]}
    >
      {/* 顶部高光 */}
      <View style={styles.gloss} pointerEvents="none" />

      {/* 图标 */}
      <Text style={isContinue ? styles.iconContinue : styles.iconEnd}>
        {isContinue ? '▶' : '■'}
      </Text>

      {/* 中文 */}
      <Text style={isContinue ? styles.labelCnContinue : styles.labelCnEnd}>
        {isContinue ? '继续' : '结束'}
      </Text>

      {/* 英文副标 */}
      <Text style={isContinue ? styles.labelEnContinue : styles.labelEnEnd}>
        {isContinue ? 'CONTINUE' : 'END'}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    height: 86,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
    borderWidth: 1,
  },
  btnContinue: {
    backgroundColor: colors.accentDeeper,
    borderColor: 'rgba(0, 229, 168, 0.42)',
    shadowColor: colors.accent,
    shadowOpacity: 0.28,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  btnEnd: {
    backgroundColor: '#1a0d08',
    borderColor: 'rgba(255, 107, 61, 0.35)',
    shadowColor: colors.warn,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  iconContinue: {
    fontSize: 17,
    color: colors.accentBright,
    textShadowColor: 'rgba(0,229,168,0.5)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
    lineHeight: 17,
  },
  iconEnd: {
    fontSize: 17,
    color: colors.warn,
    textShadowColor: 'rgba(255,107,61,0.4)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
    lineHeight: 17,
  },

  labelCnContinue: {
    fontFamily: fonts.cn,
    fontSize: 17,
    fontWeight: fonts.weights.bold,
    color: colors.accentBright,
    letterSpacing: 3.74,
    paddingLeft: 3.74,
    lineHeight: 19,
    marginTop: 2,
  },
  labelCnEnd: {
    fontFamily: fonts.cn,
    fontSize: 17,
    fontWeight: fonts.weights.bold,
    color: colors.warn,
    letterSpacing: 3.74,
    paddingLeft: 3.74,
    lineHeight: 19,
    marginTop: 2,
  },

  labelEnContinue: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: 'rgba(0, 229, 168, 0.7)',
    letterSpacing: 3.36,
    paddingLeft: 3.36,
    marginTop: 2,
  },
  labelEnEnd: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: 'rgba(255, 107, 61, 0.7)',
    letterSpacing: 3.36,
    paddingLeft: 3.36,
    marginTop: 2,
  },
});
