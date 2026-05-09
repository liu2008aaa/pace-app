/**
 * InRun · Phone 03 跑步进行中
 *
 * 实时显示：
 *   - 灵动岛 LIVE 胶囊（距离 + 配速）
 *   - 顶部元数据条（户外跑 / GPS 锁定 / 11°C）
 *   - 巨型实时配速 5'24"（呼吸光晕）
 *   - 距离 + 时长 副指标
 *   - 心率区间条 + marker
 *   - 心率卡片
 *   - 长按提示
 *
 * 交互：
 *   - 长按屏幕任意位置 1.5s → 触觉反馈 + runStore.pauseRun() + router.push('/pause')
 *   - 数据由 runStore._tick() 每秒推进，显示 reactive 更新
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { PaceHuge } from '@/src/components/PaceHuge';
import { HRZoneBar } from '@/src/components/HRZoneBar';
import { HRCard } from '@/src/components/HRCard';
import { useRunStore } from '@/src/stores/runStore';
import {
  formatPace,
  formatDuration,
  formatDistance,
  getHeartRateMarkerPosition,
} from '@/src/lib/format';
import { colors, fonts } from '@/src/theme';

export default function InRun() {
  const router = useRouter();
  const distance = useRunStore((s) => s.distance);
  const duration = useRunStore((s) => s.duration);
  const pace = useRunStore((s) => s.pace);
  const heartRate = useRunStore((s) => s.heartRate);
  const pauseRun = useRunStore((s) => s.pauseRun);

  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    pauseRun();
    router.push('/pause');
  };

  // 1.5 秒长按手势
  const longPress = Gesture.LongPress()
    .minDuration(1500)
    .onStart(() => {
      runOnJS(handlePause)();
    });

  const distanceText = formatDistance(distance);
  const durationText = formatDuration(duration);
  const paceText = formatPace(pace);
  const markerPosition = getHeartRateMarkerPosition(heartRate);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* 真实灵动岛需要 ActivityKit + EAS Build, Expo Go 无法访问;
          PhoneStatusBar 已删, 由 iOS 真状态栏 + _layout.tsx StatusBar 处理 */}
      <GestureDetector gesture={longPress}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          {/* Top metadata strip */}
          <View style={styles.metaStrip}>
            <Text style={styles.metaCn}>户外跑</Text>
            <View style={styles.gpsRow}>
              <View style={styles.gpsDot} />
              <Text style={styles.metaCn}>GPS 锁定</Text>
            </View>
            <Text style={styles.metaText}>11°C</Text>
          </View>

          {/* 中央焦点 */}
          <View style={styles.center}>
            <Text style={styles.paceLabel}>实时配速</Text>
            <View style={{ height: 6 }} />
            <PaceHuge text={paceText} />
            <View style={{ height: 4 }} />
            <Text style={styles.paceUnit}>MIN / KM</Text>

            {/* SPLIT 分隔线 */}
            <View style={styles.splitDivider}>
              <View style={styles.splitLine} />
              <Text style={styles.splitLabel}>SPLIT 0{Math.floor(distance / 1000) + 1}</Text>
              <View style={styles.splitLine} />
            </View>

            {/* 副指标 */}
            <View style={styles.subStats}>
              <View style={styles.subStatCol}>
                <Text style={styles.subStatValue}>
                  {distanceText}
                  <Text style={styles.subStatUnit}> km</Text>
                </Text>
                <Text style={styles.subStatLabel}>距离</Text>
              </View>
              <View style={styles.subStatDivider} />
              <View style={styles.subStatCol}>
                <Text style={styles.subStatValue}>{durationText}</Text>
                <Text style={styles.subStatLabel}>时长</Text>
              </View>
            </View>
          </View>

          {/* HR Zone bar */}
          <View style={styles.hrZoneWrapper}>
            <HRZoneBar position={markerPosition} />
          </View>

          {/* HR Card */}
          <View style={styles.hrCardWrapper}>
            <HRCard bpm={heartRate} />
          </View>

          {/* 长按提示 */}
          <View style={styles.longPressHint}>
            <View style={styles.hintDot} />
            <Text style={styles.hintText}>长按 → 暂停 / 结束</Text>
            <View style={styles.hintDot} />
          </View>
        </ScrollView>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  metaStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  metaCn: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.text3,
    letterSpacing: 1.7,
  },
  metaText: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.text3,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  gpsDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.7,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },

  center: {
    alignItems: 'center',
    paddingTop: 28,
    flex: 1,
  },
  paceLabel: {
    fontFamily: fonts.cn,
    fontSize: 10,
    color: colors.text3,
    letterSpacing: 3.2,
  },
  paceUnit: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.accent,
    opacity: 0.75,
    letterSpacing: 3.8,
  },

  splitDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '60%',
    marginTop: 24,
    marginBottom: 18,
  },
  splitLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.hairlineBright,
  },
  splitLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.text4,
    letterSpacing: 2.4,
  },

  subStats: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 28,
  },
  subStatCol: {
    alignItems: 'center',
    gap: 6,
  },
  subStatValue: {
    fontFamily: fonts.mono,
    fontSize: 26,
    fontWeight: fonts.weights.semibold,
    color: '#fff',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  subStatUnit: {
    fontSize: 11,
    color: colors.text3,
    fontWeight: fonts.weights.regular,
  },
  subStatLabel: {
    fontFamily: fonts.cn,
    fontSize: 9,
    color: colors.text3,
    letterSpacing: 1.98,
  },
  subStatDivider: {
    width: 0.5,
    height: 32,
    backgroundColor: colors.hairlineBright,
    marginBottom: 14,
  },

  hrZoneWrapper: {
    marginTop: 28,
    marginBottom: 12,
  },
  hrCardWrapper: {
    marginTop: 4,
  },

  longPressHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  hintDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: colors.text4,
  },
  hintText: {
    fontFamily: fonts.cn,
    fontSize: 9,
    color: colors.text4,
    letterSpacing: 1.4,
  },
});
