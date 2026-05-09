/**
 * PostRun · Phone 04 结束总结
 *
 * 当用户从 Paused 页点击「确认结束」后到达。
 * 数据从 runStore 读取（state = 'ended'，但字段尚未 reset）。
 * 关闭/分享/备注按钮触发后，调用 reset() 清空 store + 跳转。
 *
 * 顶部到底部：
 *   1. Brand strip (5月7日 · 总结 / 夜跑)
 *   2. AI 解读卡片
 *   3. 路线小地图
 *   4. 3 数据卡（距离 / 时长 / 平均配速）
 *   5. 配速曲线
 *   6. HR 区间环 + Legend
 *   7. 2 按钮（分享 / + 备注）
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { AIInsight } from '@/src/components/AIInsight';
import { RouteMap } from '@/src/components/RouteMap';
import { PaceCurve } from '@/src/components/PaceCurve';
import { HRDonut } from '@/src/components/HRDonut';
import { useRunStore } from '@/src/stores/runStore';
import {
  formatPace,
  formatDuration,
  formatDistance,
} from '@/src/lib/format';
import { colors, fonts } from '@/src/theme';

export default function PostRun() {
  const router = useRouter();
  const distance = useRunStore((s) => s.distance);
  const duration = useRunStore((s) => s.duration);
  const heartRate = useRunStore((s) => s.heartRate);
  const reset = useRunStore((s) => s.reset);

  // 计算平均配速
  const avgPace = distance > 0 ? duration / (distance / 1000) : 0;
  const distanceText = formatDistance(distance);
  const durationText = formatDuration(duration);
  const paceText = formatPace(avgPace);

  // v0.3 splits 写死（5 段递减），下版接真实 splits 从 historyStore
  const splits = [334, 318, 312, 308, 302];

  // 当前日期（中文）
  const now = new Date();
  const dateLabel = `${now.getMonth() + 1}月${now.getDate()}日`;
  const isEvening = now.getHours() >= 17;
  const sessionLabel = isEvening ? '夜跑' : '晨跑';

  const handleShare = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push('/share');
  };

  const handleAddNote = () => {
    Haptics.selectionAsync().catch(() => {});
    // v0.3 占位：后续接 modal text input
  };

  const handleClose = () => {
    Haptics.selectionAsync().catch(() => {});
    reset();
    router.dismissAll();
    router.replace('/');
  };

  const handleAIInsightPress = () => {
    Haptics.selectionAsync().catch(() => {});
    // 后续：router.push('/coach') 带本次跑步上下文
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand strip */}
        <View style={styles.brandStrip}>
          <Text style={styles.brandLabel}>{dateLabel} · 总结</Text>
          <Text style={styles.brandSession} onPress={handleClose}>
            {sessionLabel}  ✕
          </Text>
        </View>

        {/* AI Insight */}
        <View style={{ marginTop: 12 }}>
          <AIInsight
            text={`今晚状态稳定。最后 1 公里 ${formatPace(splits[splits.length - 1])} —— 30 天内最强尾段。`}
            highlight={formatPace(splits[splits.length - 1])}
            onPress={handleAIInsightPress}
          />
        </View>

        {/* 路线小地图 */}
        <View style={{ marginTop: 10 }}>
          <RouteMap title={`ROUTE · ${distanceText} KM`} />
        </View>

        {/* 3 数据卡 */}
        <View style={styles.statCards}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{distanceText}</Text>
            <Text style={styles.statLabel}>公里</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{durationText}</Text>
            <Text style={styles.statLabel}>时长</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{paceText}</Text>
            <Text style={styles.statLabel}>平均配速</Text>
          </View>
        </View>

        {/* 配速曲线 */}
        <View style={{ marginTop: 12 }}>
          <PaceCurve splits={splits} />
        </View>

        {/* HR 区间环 */}
        <View style={{ marginTop: 14 }}>
          <HRDonut avgBPM={heartRate || 142} />
        </View>

        {/* 底部 2 按钮 */}
        <View style={styles.actionRow}>
          <View style={[styles.btn, styles.btnPrimary]} onTouchEnd={handleShare}>
            <Text style={styles.btnPrimaryText}>分享</Text>
          </View>
          <View style={[styles.btn, styles.btnSecondary]} onTouchEnd={handleAddNote}>
            <Text style={styles.btnSecondaryText}>+ 备注</Text>
          </View>
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
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  brandStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  brandLabel: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.text3,
    letterSpacing: 1.7,
  },
  brandSession: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.accent,
    letterSpacing: 1.7,
  },

  statCards: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 0.5,
    borderColor: colors.hairline,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  statValue: {
    fontFamily: fonts.mono,
    fontSize: 18,
    fontWeight: fonts.weights.semibold,
    color: '#fff',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontFamily: fonts.cn,
    fontSize: 9,
    color: colors.text3,
    letterSpacing: 1.4,
    marginTop: 2,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  btnPrimaryText: {
    fontFamily: fonts.cn,
    fontSize: 13,
    fontWeight: fonts.weights.bold,
    color: '#001A14',
    letterSpacing: 1.5,
  },
  btnSecondary: {
    backgroundColor: colors.bgElev,
    borderWidth: 0.5,
    borderColor: colors.hairlineBright,
  },
  btnSecondaryText: {
    fontFamily: fonts.cn,
    fontSize: 13,
    color: '#fff',
    letterSpacing: 1.5,
  },
});
