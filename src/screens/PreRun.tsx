/**
 * PreRun · Phone 02 跑前预热
 *
 * 流程：
 *   1. 进入屏幕，runStore.enterPreRun() 重置状态
 *   2. 显示 4 项系统检查（GPS / 心率 / 音乐 / 语音）— v0.2 全部 mock 为 ok
 *   3. CountdownRing 倒数 3 → 2 → 1 → 出发（每秒触觉反馈）
 *   4. 倒数完成 → runStore.startRun() + router.replace('/run')
 *
 * 长按取消（顶部小提示）暂未实现，后续在 v0.2.1 加 LongPress + router.back()
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { CountdownRing } from '@/src/components/CountdownRing';
import { ChecklistRow } from '@/src/components/ChecklistRow';
import { useRunStore } from '@/src/stores/runStore';
import { colors, fonts } from '@/src/theme';

export default function PreRun() {
  const router = useRouter();
  const enterPreRun = useRunStore((s) => s.enterPreRun);
  const startRun = useRunStore((s) => s.startRun);

  // 进入屏幕时重置 store 到 preRun 状态
  useEffect(() => {
    enterPreRun();
  }, [enterPreRun]);

  const handleCountdownComplete = () => {
    startRun();
    router.replace('/run');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top brand strip */}
        <View style={styles.brandStrip}>
          <Text style={styles.brandCn}>准备开跑</Text>
          <Text style={styles.brandEn}>PRE-FLIGHT CHECK</Text>
        </View>

        {/* 中央倒数环 */}
        <View style={styles.countdownArea}>
          <Text style={styles.countdownLabel}>COUNTDOWN</Text>
          <View style={{ height: 12 }} />
          <CountdownRing seconds={3} onComplete={handleCountdownComplete} />
          <View style={{ height: 12 }} />
          <Text style={styles.countdownHint}>深呼吸，跑姿调整</Text>
        </View>

        {/* 系统就绪 清单 */}
        <View style={styles.checklist}>
          <Text style={styles.checklistTitle}>系统就绪 · SYSTEM CHECK</Text>
          <ChecklistRow status="ok" label="GPS" detail="已锁定 12 颗卫星" />
          <ChecklistRow status="ok" label="心率" detail="76 BPM 静息" />
          <ChecklistRow status="ok" label="音乐" detail="网易云 · 礼让模式" />
          <ChecklistRow status="ok" label="语音" detail="每 1 km · 中文女声" />
        </View>

        <View style={{ flex: 1 }} />

        {/* 底部取消提示 */}
        <View style={styles.cancelHint}>
          <View style={styles.cancelDot} />
          <Text style={styles.cancelTextCn}>长按取消</Text>
          <Text style={styles.cancelDivider}>·</Text>
          <Text style={styles.cancelTextEn}>HOLD TO CANCEL</Text>
          <View style={styles.cancelDot} />
        </View>
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
    paddingBottom: 24,
  },

  brandStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  brandCn: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.text3,
    letterSpacing: 2,
  },
  brandEn: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.text3,
    letterSpacing: 1.7,
  },

  countdownArea: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  countdownLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.text3,
    letterSpacing: 3.2,
  },
  countdownHint: {
    fontFamily: fonts.cn,
    fontSize: 12,
    color: colors.text2,
    letterSpacing: 2,
  },

  checklist: {
    marginTop: 20,
  },
  checklistTitle: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.text3,
    letterSpacing: 2.7,
    marginBottom: 8,
  },

  cancelHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
  },
  cancelDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: colors.text4,
  },
  cancelTextCn: {
    fontFamily: fonts.cn,
    fontSize: 8.5,
    color: colors.text4,
    letterSpacing: 1.7,
  },
  cancelDivider: {
    color: colors.text3,
  },
  cancelTextEn: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.text4,
    letterSpacing: 2.5,
  },
});
