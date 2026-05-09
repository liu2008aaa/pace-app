/**
 * Paused · Phone 12 暂停状态
 *
 * 跑步过程中长按触发，runStore 已被设为 paused。
 * - 中央：last pace（变灰） + 距离/时长（保持白色）
 * - 心率区间条：opacity 0.55 + marker 变金色
 * - 底部两颗大按钮：继续 / 结束
 *   - 继续：恢复 store + router.back() 回 /run
 *   - 结束：弹出 Alert 二次确认 → 确认则 endRun() + reset() + 跳回首页
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { PhoneStatusBar } from '@/src/components/PhoneStatusBar';
import { LiveActivity } from '@/src/components/LiveActivity';
import { PaceHuge } from '@/src/components/PaceHuge';
import { HRZoneBar } from '@/src/components/HRZoneBar';
import { ActionButton } from '@/src/components/ActionButton';
import { useRunStore } from '@/src/stores/runStore';
import {
  formatPace,
  formatDuration,
  formatDistance,
  getHeartRateMarkerPosition,
} from '@/src/lib/format';
import { colors, fonts } from '@/src/theme';

export default function Paused() {
  const router = useRouter();
  const distance = useRunStore((s) => s.distance);
  const duration = useRunStore((s) => s.duration);
  const pace = useRunStore((s) => s.pace);
  const heartRate = useRunStore((s) => s.heartRate);
  const resumeRun = useRunStore((s) => s.resumeRun);
  const endRun = useRunStore((s) => s.endRun);

  const handleContinue = () => {
    resumeRun();
    router.back(); // 回到 /run
  };

  const handleEnd = () => {
    Alert.alert(
      '结束本次跑步？',
      `已跑 ${formatDistance(distance)} km · ${formatDuration(duration)}\n\n确认后会保存到历史并查看总结。`,
      [
        { text: '继续跑步', style: 'cancel' },
        {
          text: '确认结束',
          style: 'destructive',
          onPress: () => {
            endRun(); // 写入 historyStore + 设状态为 ended（store 字段保留供 PostRun 读取）
            router.dismissAll();
            router.replace('/post-run');
          },
        },
      ]
    );
  };

  const distanceText = formatDistance(distance);
  const durationText = formatDuration(duration);
  const paceText = formatPace(pace);
  const markerPosition = getHeartRateMarkerPosition(heartRate);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <LiveActivity mode="paused" duration={durationText} />

      <PhoneStatusBar time="9:58" signal={4} battery={87} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* Top metadata strip */}
        <View style={styles.metaStrip}>
          <Text style={styles.metaCn}>户外跑</Text>
          <View style={styles.pausedRow}>
            <View style={styles.pausedDot} />
            <Text style={styles.metaPausedCn}>已暂停</Text>
          </View>
          <Text style={styles.metaText}>11°C</Text>
        </View>

        {/* PAUSED hero */}
        <View style={styles.center}>
          <Text style={styles.pausedTitle}>已暂停</Text>
          <View style={{ height: 8 }} />
          <PaceHuge text={paceText} paused />
          <View style={{ height: 4 }} />
          <Text style={styles.pausedSubtitle}>LAST PACE · 静止中</Text>

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

        {/* HR Zone bar (paused mode) */}
        <View style={styles.hrZoneWrapper}>
          <HRZoneBar position={markerPosition} paused zoneLabel="Z2 · 静息中" />
        </View>

        <View style={{ flex: 1 }} />

        {/* 大按钮：继续 / 结束 */}
        <View style={styles.actionRow}>
          <ActionButton variant="continue" onPress={handleContinue} />
          <View style={{ width: 10 }} />
          <ActionButton variant="end" onPress={handleEnd} />
        </View>

        {/* 二次确认提示 */}
        <Text style={styles.confirmHint}>
          点击「结束」需二次确认 · TAP TO CONFIRM
        </Text>
      </ScrollView>
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
    marginBottom: 16,
  },
  metaCn: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.text3,
    letterSpacing: 1.7,
  },
  metaPausedCn: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.gold,
    letterSpacing: 1.5,
  },
  metaText: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.text3,
  },
  pausedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pausedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },

  center: {
    alignItems: 'center',
    paddingTop: 16,
  },
  pausedTitle: {
    fontFamily: fonts.cn,
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 4.4,
  },
  pausedSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.text4,
    letterSpacing: 3.2,
  },

  subStats: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 28,
    marginTop: 36,
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
  },

  actionRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  confirmHint: {
    fontFamily: fonts.cn,
    fontSize: 8.5,
    color: colors.text4,
    letterSpacing: 1.7,
    textAlign: 'center',
  },
});
