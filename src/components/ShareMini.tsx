/**
 * ShareMini · 分享卡缩略图 (4 种风格变体)
 *
 * Phone 05 的 2x2 gallery 用。每个 mini 都是一个完整的可分享设计，
 * 缩到 ~140x174 大小预览。
 *
 * Variants:
 *   - classic: 品牌行 + 数字 + 路线 + 4 数据 + AI 引言
 *   - minimal: 仅一个巨型数字居中 + 角落小字
 *   - poster: 路线满铺 + 文字叠在底部
 *   - data: 配速曲线 + 5 段分割表
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Line,
  Rect,
  G,
} from 'react-native-svg';
import { colors, fonts } from '@/src/theme';

export type ShareVariant = 'classic' | 'minimal' | 'poster' | 'data';

interface Props {
  variant: ShareVariant;
  active: boolean;
  /** 显示数据（distance / duration / pace 都已 format 好） */
  distance: string;   // "5.42"
  duration: string;   // "28:14"
  pace: string;       // "5'12""
  hr: number;         // 152
  date: string;       // "05·07"
  onPress?: () => void;
}

const TAGS: Record<ShareVariant, { cn: string; en: string }> = {
  classic: { cn: '经典', en: 'CLASSIC' },
  minimal: { cn: '极简', en: 'MINIMAL' },
  poster: { cn: '海报', en: 'POSTER' },
  data: { cn: '数据', en: 'DATA' },
};

export function ShareMini(props: Props) {
  const { variant, active, onPress } = props;
  const tag = TAGS[variant];

  return (
    <View
      style={[
        styles.card,
        active && styles.cardActive,
        variant === 'classic' && styles.bgClassic,
        variant === 'minimal' && styles.bgMinimal,
        variant === 'data' && styles.bgData,
      ]}
      onTouchEnd={onPress}
    >
      {/* 顶部 tag */}
      <View style={[styles.tag, active && styles.tagActive]}>
        <Text style={[styles.tagText, active && styles.tagTextActive]}>
          {tag.cn}
        </Text>
      </View>
      <Text style={[styles.tagEn, active && styles.tagEnActive]}>
        {tag.en}
      </Text>

      {/* Variant content */}
      {variant === 'classic' && <ClassicContent {...props} />}
      {variant === 'minimal' && <MinimalContent {...props} />}
      {variant === 'poster' && <PosterContent {...props} />}
      {variant === 'data' && <DataContent {...props} />}
    </View>
  );
}

/* ============================================================
 * Classic
 * ============================================================ */
function ClassicContent({ distance, duration, pace, hr, date }: Props) {
  return (
    <View style={cstyles.content}>
      <View style={cstyles.brandRow}>
        <Text style={cstyles.brand}>
          Pace<Text style={cstyles.brandDot}>.</Text>
        </Text>
        <Text style={cstyles.date}>{date}</Text>
      </View>
      <Text style={cstyles.bigNum}>{distance}</Text>
      <Svg width="100%" height={20} viewBox="0 0 110 20" style={{ marginTop: 5 }}>
        <Path
          d="M 4 16 C 18 16, 26 4, 40 6 S 64 12, 78 4 S 100 10, 106 14"
          fill="none"
          stroke={colors.accent}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        <Circle cx={4} cy={16} r={1.5} fill="none" stroke={colors.accent} strokeWidth={0.8} />
        <Circle cx={106} cy={14} r={1.5} fill={colors.accentBright} />
      </Svg>
      <View style={cstyles.statsRow}>
        <Text style={cstyles.stat}>{duration}</Text>
        <Text style={cstyles.stat}>{pace.replace('"', '')}</Text>
        <Text style={cstyles.stat}>{hr}</Text>
        <Text style={cstyles.stat}>420</Text>
      </View>
      <Text style={cstyles.quote}>✦ 30 天最强尾段</Text>
    </View>
  );
}

const cstyles = StyleSheet.create({
  content: {
    padding: 9,
    paddingTop: 24,
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  brand: {
    fontFamily: fonts.sans,
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: '#fff',
    letterSpacing: -0.4,
  },
  brandDot: {
    color: colors.accent,
  },
  date: {
    fontFamily: fonts.mono,
    fontSize: 7.5,
    color: colors.text3,
    letterSpacing: 1.3,
  },
  bigNum: {
    fontFamily: fonts.mono,
    fontSize: 28,
    fontWeight: fonts.weights.semibold,
    color: '#fff',
    letterSpacing: -1.1,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stat: {
    fontFamily: fonts.mono,
    fontSize: 7,
    color: colors.text2,
  },
  quote: {
    fontFamily: fonts.cn,
    fontSize: 7.5,
    color: colors.text3,
    fontStyle: 'italic',
    marginTop: 'auto',
  },
});

/* ============================================================
 * Minimal
 * ============================================================ */
function MinimalContent({ distance, duration, date }: Props) {
  return (
    <View style={mstyles.content}>
      <Text style={mstyles.brand}>
        P<Text style={mstyles.brandDot}>.</Text>
      </Text>
      <View style={mstyles.center}>
        <Text style={mstyles.bigNum}>{distance}</Text>
        <Text style={mstyles.unit}>公里</Text>
      </View>
      <Text style={mstyles.bottomDate}>
        {date.replace('·', '月')}日 · {duration}
      </Text>
      <Text style={mstyles.star}>✦</Text>
    </View>
  );
}

const mstyles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 9,
    paddingTop: 24,
    position: 'relative',
  },
  brand: {
    fontFamily: fonts.sans,
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: '#fff',
    letterSpacing: -0.4,
  },
  brandDot: {
    color: colors.accent,
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
  bigNum: {
    fontFamily: fonts.mono,
    fontSize: 36,
    fontWeight: fonts.weights.medium,
    color: '#fff',
    letterSpacing: -1.4,
  },
  unit: {
    fontFamily: fonts.cn,
    fontSize: 9,
    color: colors.text3,
    letterSpacing: 3,
    marginTop: 5,
  },
  bottomDate: {
    position: 'absolute',
    bottom: 9,
    left: 9,
    fontFamily: fonts.mono,
    fontSize: 7,
    color: colors.text3,
    letterSpacing: 1.1,
  },
  star: {
    position: 'absolute',
    bottom: 9,
    right: 9,
    color: colors.accent,
    fontSize: 11,
    opacity: 0.5,
  },
});

/* ============================================================
 * Poster (path + 底部文字叠加)
 * ============================================================ */
function PosterContent({ distance, duration }: Props) {
  return (
    <View style={pstyles.content}>
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 130 174"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <RadialGradient id="posterBg" cx="30%" cy="30%">
            <Stop offset="0%" stopColor="#0a3024" stopOpacity={0.85} />
            <Stop offset="100%" stopColor="#000000" />
          </RadialGradient>
        </Defs>
        <Rect width={130} height={174} fill="url(#posterBg)" />

        {/* Terrain dots */}
        <G opacity={0.4}>
          <Circle cx={20} cy={40} r={0.6} fill={colors.accent} />
          <Circle cx={42} cy={80} r={0.5} fill={colors.accent} />
          <Circle cx={70} cy={38} r={0.5} fill={colors.accent} />
          <Circle cx={100} cy={92} r={0.6} fill={colors.accent} />
          <Circle cx={60} cy={115} r={0.5} fill={colors.accent} />
          <Circle cx={22} cy={92} r={0.5} fill={colors.accent} />
          <Circle cx={105} cy={55} r={0.5} fill={colors.accent} />
        </G>

        {/* Route */}
        <Path
          d="M 10 88 C 30 92, 50 60, 70 64 S 100 78, 120 70"
          fill="none"
          stroke={colors.accent}
          strokeOpacity={0.18}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <Path
          d="M 10 88 C 30 92, 50 60, 70 64 S 100 78, 120 70"
          fill="none"
          stroke={colors.accent}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Circle cx={10} cy={88} r={2.5} fill="none" stroke={colors.accent} strokeWidth={1} />
        <Circle cx={10} cy={88} r={0.8} fill={colors.accent} />
        <Circle cx={120} cy={70} r={2.5} fill={colors.accentBright} />
      </Svg>

      {/* 底部文字叠层 */}
      <View style={pstyles.bottomOverlay}>
        <Text style={pstyles.brand}>
          PACE<Text style={pstyles.brandDot}>.</Text>
        </Text>
        <Text style={pstyles.title}>{distance} KM</Text>
        <Text style={pstyles.subtitle}>{duration} · NIGHT RUN</Text>
      </View>
    </View>
  );
}

const pstyles = StyleSheet.create({
  content: {
    flex: 1,
    position: 'relative',
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 9,
    paddingVertical: 9,
    backgroundColor: 'rgba(0,0,0,0.55)', // approximate gradient
  },
  brand: {
    fontFamily: fonts.sans,
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: '#fff',
    letterSpacing: -0.4,
  },
  brandDot: {
    color: colors.accent,
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: 20,
    fontWeight: fonts.weights.bold,
    color: '#fff',
    letterSpacing: -0.4,
    marginTop: 4,
    textShadowColor: 'rgba(0,229,168,0.4)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 6.5,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.2,
    marginTop: 3,
  },
});

/* ============================================================
 * Data
 * ============================================================ */
function DataContent({ distance, duration }: Props) {
  const splits = [
    { km: 1, val: "5'34\"", hi: false },
    { km: 2, val: "5'18\"", hi: false },
    { km: 3, val: "5'12\"", hi: false },
    { km: 4, val: "5'08\"", hi: false },
    { km: 5, val: "5'02\"", hi: true },
  ];

  return (
    <View style={dstyles.content}>
      <View style={dstyles.header}>
        <Text style={dstyles.brand}>
          Pace<Text style={dstyles.brandDot}>.</Text>
        </Text>
        <Text style={dstyles.meta}>{distance} KM</Text>
      </View>

      {/* Mini pace curve */}
      <Svg width="100%" height={28} viewBox="0 0 110 28" style={{ marginBottom: 3 }}>
        <Line x1={0} y1={9} x2={110} y2={9} stroke="rgba(255,255,255,0.04)" strokeDasharray="1 3" />
        <Line x1={0} y1={20} x2={110} y2={20} stroke="rgba(255,255,255,0.04)" strokeDasharray="1 3" />
        <Path
          d="M 4 13 L 26 20 L 48 16 L 70 22 L 100 5"
          fill="none"
          stroke={colors.accent}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={4} cy={13} r={0.9} fill={colors.accent} />
        <Circle cx={26} cy={20} r={0.9} fill={colors.accent} />
        <Circle cx={48} cy={16} r={0.9} fill={colors.accent} />
        <Circle cx={70} cy={22} r={0.9} fill={colors.accent} />
        <Circle cx={100} cy={5} r={1.5} fill={colors.accentBright} />
      </Svg>

      {/* Splits table */}
      <View style={dstyles.splits}>
        {splits.map((s) => (
          <View
            key={s.km}
            style={[
              dstyles.splitRow,
              s.hi && dstyles.splitRowHi,
            ]}
          >
            <Text style={[dstyles.splitKm, s.hi && dstyles.splitKmHi]}>
              {s.km}
            </Text>
            <Text style={[dstyles.splitVal, s.hi && dstyles.splitValHi]}>
              {s.val}
            </Text>
          </View>
        ))}
      </View>

      <View style={dstyles.foot}>
        <Text style={dstyles.footText}>HR Z3·42%</Text>
        <Text style={dstyles.footText}>152 AVG</Text>
      </View>
    </View>
  );
}

const dstyles = StyleSheet.create({
  content: {
    padding: 7,
    paddingTop: 24,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  brand: {
    fontFamily: fonts.sans,
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: '#fff',
    letterSpacing: -0.4,
  },
  brandDot: {
    color: colors.accent,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 7,
    color: colors.accent,
    letterSpacing: 0.4,
  },
  splits: {
    flex: 1,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  splitRowHi: {
    backgroundColor: 'rgba(0,229,168,0.08)',
  },
  splitKm: {
    fontFamily: fonts.mono,
    fontSize: 7.5,
    color: colors.text3,
    width: 6,
  },
  splitKmHi: {
    color: colors.accent,
    fontWeight: fonts.weights.semibold,
  },
  splitVal: {
    fontFamily: fonts.mono,
    fontSize: 7.5,
    color: '#fff',
  },
  splitValHi: {
    color: colors.accent,
    fontWeight: fonts.weights.semibold,
  },
  foot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 3,
    borderTopWidth: 0.5,
    borderTopColor: colors.hairline,
    marginTop: 3,
  },
  footText: {
    fontFamily: fonts.mono,
    fontSize: 6.5,
    color: colors.text3,
    letterSpacing: 0.6,
  },
});

/* ============================================================
 * Card-level styles
 * ============================================================ */
const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 174,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.hairline,
    overflow: 'hidden',
    position: 'relative',
  },
  cardActive: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  bgClassic: {
    backgroundColor: '#050a08',
  },
  bgMinimal: {
    backgroundColor: '#000000',
  },
  bgData: {
    backgroundColor: '#0a0c0a',
  },
  tag: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
    zIndex: 5,
  },
  tagActive: {
    backgroundColor: colors.accent,
  },
  tagText: {
    fontFamily: fonts.cn,
    fontSize: 9,
    color: '#fff',
    letterSpacing: 1.4,
    fontWeight: fonts.weights.medium,
  },
  tagTextActive: {
    color: '#001A14',
    fontWeight: fonts.weights.bold,
  },
  tagEn: {
    position: 'absolute',
    top: 8,
    right: 7,
    fontFamily: fonts.mono,
    fontSize: 6.5,
    color: colors.text4,
    letterSpacing: 1.4,
    zIndex: 5,
  },
  tagEnActive: {
    color: colors.accent,
    opacity: 0.7,
  },
});
