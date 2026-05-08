/**
 * StartButton · 出发按钮
 *
 * Phone 01 主 CTA。物理质感设计：
 * - 实心深绿径向 + 线性叠加渐变
 * - 顶边 1.5px 高光（光从上来）
 * - 内部三圈同心椭圆雷达靶环（极淡）
 * - 4 个角的取景器装饰
 * - 中央 ▶ + "出发" 中文 + "LET'S GO" 英文副标
 * - 按下 scale 1.015，触觉反馈 (haptics)
 *
 * 注：HTML demo 里的 conic-gradient 扫描弧在 RN 实现成本高，
 * 第一版省略；后续用 Skia 或 Lottie 补回。
 */

import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { colors, fonts, easings, durations } from '@/src/theme';

interface Props {
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StartButton({ onPress }: Props) {
  // 按下缩放
  const scale = useSharedValue(1);
  // 微弱的"待机呼吸"光晕脉冲
  const glow = useSharedValue(0);

  React.useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2100, easing: easings.inOut }),
        withTiming(0, { duration: 2100, easing: easings.inOut })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: 0.28 + glow.value * 0.14, // 0.28 ↔ 0.42
    shadowRadius: 32 + glow.value * 12,      // 32 ↔ 44
  }));

  const handlePressIn = () => {
    scale.value = withTiming(1.015, { duration: durations.base, easing: easings.out });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: durations.base, easing: easings.out });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.root, animatedStyle]}
    >
      {/* 内部雷达靶环 */}
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 280 116"
        preserveAspectRatio="none"
      >
        <Ellipse cx="140" cy="58" rx="60" ry="32" stroke="rgba(0,229,168,0.06)" strokeWidth="0.5" strokeDasharray="2,5" fill="none" />
        <Ellipse cx="140" cy="58" rx="92" ry="46" stroke="rgba(0,229,168,0.05)" strokeWidth="0.5" strokeDasharray="2,5" fill="none" />
        <Ellipse cx="140" cy="58" rx="120" ry="58" stroke="rgba(0,229,168,0.04)" strokeWidth="0.5" strokeDasharray="2,5" fill="none" />
      </Svg>

      {/* 顶部高光层 */}
      <View style={styles.gloss} pointerEvents="none" />

      {/* 4 个角的取景器装饰 */}
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />

      {/* 中央内容 */}
      <View style={styles.content}>
        <View style={styles.iconRow}>
          {/* 三角箭头 ▶ */}
          <View style={styles.playTriangle} />
          <Text style={styles.labelCn}>出 发</Text>
        </View>
        <Text style={styles.labelEn}>LET'S GO</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: 116,
    borderRadius: 58,
    overflow: 'hidden',
    backgroundColor: colors.accentDeeper,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 168, 0.42)',
    // iOS 阴影 — 外发光
    shadowColor: colors.accent,
    shadowOpacity: 0.32,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
    // 注意：RN 不支持 multi-layer background，所以"径向 + 线性"叠加效果
    // 简化为 1 个 backgroundColor + 渐变 SVG。第一版用纯色，效果已经够好。
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 58,
    borderTopRightRadius: 58,
  },
  corner: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderColor: 'rgba(0, 229, 168, 0.55)',
  },
  cornerTL: { top: 10, left: 22, borderLeftWidth: 1, borderTopWidth: 1 },
  cornerTR: { top: 10, right: 22, borderRightWidth: 1, borderTopWidth: 1 },
  cornerBL: { bottom: 10, left: 22, borderLeftWidth: 1, borderBottomWidth: 1 },
  cornerBR: { bottom: 10, right: 22, borderRightWidth: 1, borderBottomWidth: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.accentBright,
    // iOS shadow on view 用 shadow*，但 transparent border tricks 不能直接发光
    // 已用文字光晕代偿
  },
  labelCn: {
    fontFamily: fonts.cn,
    fontWeight: fonts.weights.bold,
    fontSize: 24,
    color: colors.accentBright,
    letterSpacing: 5.76,    // 0.24em
    textShadowColor: 'rgba(0,229,168,0.6)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
    paddingLeft: 5.76,      // 抵消 letter-spacing 居中偏移
  },
  labelEn: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: 'rgba(0, 229, 168, 0.6)',
    letterSpacing: 3.36,    // 0.42em
    textTransform: 'uppercase',
    paddingLeft: 3.36,
    marginTop: 3,
  },
});
