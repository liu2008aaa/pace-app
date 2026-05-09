/**
 * IdleHome · Phone 01 待机首页
 *
 * 视觉对照 HTML demo 的 Phone 01。从上到下：
 * - PhoneStatusBar (9:41 + 信号/WiFi/电池)
 * - Brand strip (PACE. + ✦ 教练 chip)
 * - Greeting (上午好，刘宇 + 上海·晴·18°C·适合跑步)
 * - Hairline 分隔
 * - 三联表盘 (状态 / 负荷 / 睡眠)
 * - AI 一句话建议
 * - flex-1 spacer
 * - START 按钮（compact 116px）
 * - 上次跑步信息
 * - 14 天活力时间线
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { DialCard } from '@/src/components/DialCard';
import { StartButton } from '@/src/components/StartButton';
import { TimelineDots } from '@/src/components/TimelineDots';
import { Hairline } from '@/src/components/Hairline';
import { useHistoryStore } from '@/src/stores/historyStore';
import { formatPace, formatDistance } from '@/src/lib/format';
import { colors, fonts, mockData } from '@/src/theme';

export default function IdleHome() {
  const router = useRouter();
  const latestRun = useHistoryStore((s) => s.runs[0]);

  // 计算「上次跑步」展示文本：优先用 historyStore，没有则用 mock
  const lastRunDate = latestRun
    ? formatRunDate(new Date(latestRun.startedAt))
    : mockData.lastRun.date;
  const lastRunDistance = latestRun
    ? formatDistance(latestRun.distance)
    : mockData.lastRun.distance.toFixed(2);
  const lastRunPace = latestRun
    ? formatPace(latestRun.avgPace)
    : mockData.lastRun.pace;

  const handleStart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.push('/pre-run');
  };

  const handleCoachPress = () => {
    Haptics.selectionAsync().catch(() => {});
    console.log('[IdleHome] COACH pressed → /coach');
  };

  const handleDialPress = (dial: string) => {
    Haptics.selectionAsync().catch(() => {});
    console.log(`[IdleHome] dial pressed: ${dial}`);
    // 下一轮：if (dial === 'recovery') router.push('/recovery');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* iOS 真实状态栏由 _layout.tsx 的 <StatusBar style="light" /> 控制 */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand strip */}
        <View style={styles.brandStrip}>
          <Text style={styles.brandText}>
            PACE
            <Text style={styles.brandDot}>.</Text>
          </Text>
          <View style={styles.coachChip} onTouchEnd={handleCoachPress}>
            <Text style={styles.coachStar}>✦</Text>
            <Text style={styles.coachLabel}>教练</Text>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingTitle}>上午好，{mockData.user.name}</Text>
          <View style={styles.weatherRow}>
            <Text style={styles.weatherText}>{mockData.weather.city}</Text>
            <Text style={styles.weatherDot}>·</Text>
            <Text style={styles.weatherText}>{mockData.weather.condition}</Text>
            <Text style={styles.weatherDot}>·</Text>
            <Text style={styles.weatherTemp}>{mockData.weather.temp}°C</Text>
            <Text style={styles.weatherDot}>·</Text>
            <Text style={styles.weatherText}>{mockData.weather.wind}</Text>
            <Text style={styles.weatherDot}>·</Text>
            <Text style={styles.weatherSuitability}>{mockData.weather.suitability}</Text>
          </View>
        </View>

        <Hairline marginVertical={16} />

        {/* 今日体感 三联表盘 */}
        <View style={styles.metricsHeader}>
          <Text style={styles.metricsTitle}>今日体感</Text>
          <Text style={styles.metricsSubtitle}>DAILY METRICS</Text>
        </View>

        <View style={styles.triad}>
          <DialCard
            cornerMark="01"
            value={mockData.today.readiness}
            unit="/100"
            label="状态"
            meta={`↑ ${mockData.today.readinessDelta} vs 昨`}
            percent={mockData.today.readiness}
            state="good"
            onPress={() => handleDialPress('recovery')}
          />
          <View style={{ width: 7 }} />
          <DialCard
            cornerMark="02"
            value={mockData.today.strain}
            unit="/21"
            label="负荷"
            meta={mockData.today.strainStatus}
            percent={(mockData.today.strain / 21) * 100}
            state="warn"
            onPress={() => handleDialPress('strain')}
          />
          <View style={{ width: 7 }} />
          <DialCard
            cornerMark="03"
            value={`${mockData.today.sleep}%`}
            unit={mockData.today.sleepHours}
            label="睡眠"
            meta={`↑ ${mockData.today.sleepDelta}%`}
            percent={mockData.today.sleep}
            state="good"
            onPress={() => handleDialPress('sleep')}
          />
        </View>

        {/* AI 一句话建议 */}
        <View style={styles.aiSuggestion}>
          <Text style={styles.aiStar}>✦</Text>
          <Text style={styles.aiText}>
            恢复良好但<Text style={styles.aiHighlight}>负荷偏高</Text>，建议做轻松跑而非节奏跑。
          </Text>
        </View>

        {/* Spacer */}
        <View style={{ height: 32 }} />

        {/* START 按钮 */}
        <StartButton onPress={handleStart} />

        {/* 上次跑步（优先读 historyStore） */}
        <View style={styles.lastRunRow}>
          <Text style={styles.lastRunLabel}>上次</Text>
          <Text style={styles.lastRunData}>
            &nbsp;{lastRunDate} &nbsp;·&nbsp; {lastRunDistance} km &nbsp;·&nbsp;{' '}
            {lastRunPace}
            <Text style={styles.lastRunDataDim}>/km</Text>
          </Text>
        </View>

        {/* 14 天时间线 */}
        <View style={styles.timelineWrapper}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineLabel}>最近 14 天</Text>
            <Text style={styles.timelineToday}>今天</Text>
          </View>
          <TimelineDots intensities={mockData.timeline} />
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // —— Brand strip ——
  brandStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  brandText: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.text3,
    letterSpacing: 1.7, // 0.18em
    fontWeight: fonts.weights.medium,
  },
  brandDot: {
    color: colors.accent,
  },
  coachChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(0,229,168,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(0,229,168,0.3)',
  },
  coachStar: {
    color: colors.accent,
    fontSize: 11,
  },
  coachLabel: {
    color: colors.accent,
    fontFamily: fonts.cn,
    fontSize: 9,
    letterSpacing: 1.08, // 0.12em
  },

  // —— Greeting ——
  greetingBlock: {
    marginTop: 12,
  },
  greetingTitle: {
    fontFamily: fonts.cn,
    fontSize: 19,
    color: colors.text1,
    fontWeight: fonts.weights.medium,
    letterSpacing: 0.76, // 0.04em
    lineHeight: 23,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  weatherText: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.text2,
    letterSpacing: 1.52, // 0.16em
  },
  weatherTemp: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.text2,
    letterSpacing: 0.4,
  },
  weatherDot: {
    color: colors.text4,
    marginHorizontal: 6,
    fontSize: 9.5,
  },
  weatherSuitability: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.accent,
    letterSpacing: 1.33, // 0.14em
  },

  // —— Metrics header ——
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  metricsTitle: {
    fontFamily: fonts.cn,
    fontSize: 10,
    color: colors.text3,
    letterSpacing: 3.6, // 0.36em
  },
  metricsSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.text4,
    letterSpacing: 1.76, // 0.22em
  },

  // —— Triad ——
  triad: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 110,
  },

  // —— AI suggestion ——
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 12,
  },
  aiStar: {
    color: colors.accent,
    fontSize: 11,
    lineHeight: 16,
  },
  aiText: {
    flex: 1,
    fontFamily: fonts.cn,
    fontSize: 11,
    color: colors.text2,
    lineHeight: 17,
  },
  aiHighlight: {
    color: colors.gold,
    fontWeight: fonts.weights.semibold,
  },

  // —— Last run ——
  lastRunRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  lastRunLabel: {
    fontFamily: fonts.cn,
    fontSize: 10,
    color: colors.text3,
    letterSpacing: 1.8, // 0.18em
  },
  lastRunData: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.text2,
    letterSpacing: 0.4,
  },
  lastRunDataDim: {
    color: colors.text3,
  },

  // —— Timeline ——
  timelineWrapper: {
    marginTop: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineLabel: {
    fontFamily: fonts.cn,
    fontSize: 8.5,
    color: colors.text4,
    letterSpacing: 1.53, // 0.18em
  },
  timelineToday: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.accent,
    letterSpacing: 2.13, // 0.25em
  },
});

// 把 Date → "5月3日" 中文格式
function formatRunDate(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
