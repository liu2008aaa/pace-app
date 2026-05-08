/**
 * Pace. Design Tokens
 *
 * 从 HTML demo (pace-demo/index.html) 的 :root CSS 变量迁移而来。
 * 单一可信来源 (single source of truth) for colors, typography, spacing,
 * radii, shadows, and animation curves used across the app.
 */

import { Easing } from 'react-native-reanimated';

/* ============================================================
 * COLORS · 配色系统
 * ============================================================
 * 使用 5 阶背景层 + 4 阶文字 + 单一冷绿主色 + 警示橙 + 金色（中间态）
 * + 心形红（专属符号）。所有颜色都有语义，no arbitrary accents.
 */
export const colors = {
  // —— 背景层 (5 阶) ——
  bgCanvas: '#04050a',      // 最外层画布（系统级，少用）
  bgApp: '#000000',         // App 主背景 — 纯黑省 OLED 电
  bgCard: '#0B0C0F',        // 卡片层（dial card / 普通 card）
  bgElev: '#14161B',        // elevated 层（按钮 secondary、输入框）
  bgElev2: '#1B1E24',       // 更高 elevated（toggle 背景等）

  // —— 主色 (单点) ——
  accent: '#00E5A8',        // 冷绿 — 活跃数据、CTA、正向状态
  accentBright: '#29F0BD',  // 冷绿亮（强调或粒子头）
  accentDeep: '#003B2C',    // 冷绿深（按钮底色 1）
  accentDeeper: '#06281E',  // 冷绿深（按钮底色 2）

  // —— 状态色 (语义专用，不可滥用) ——
  warn: '#FF6B3D',          // 警示橙 — PB / 异常 / 高强度
  gold: '#E5C07B',          // 中间态金 — 负荷偏高、GPS 警告、PEAK 标
  live: '#FF3B30',          // 录制红点 — 跑步中 LIVE 指示
  heart: '#FF3B5C',         // 心形专用 — 仅心率图标本身

  // —— 文字 (4 阶) ——
  text1: '#FFFFFF',         // 主要文字
  text2: '#9CA0AB',         // 次要文字（标签、副标）
  text3: '#5A5E68',         // 辅助文字（caption、meta）
  text4: '#3A3D44',         // 极弱文字（占位、disabled）

  // —— 描边 ——
  hairline: '#1F2126',      // 0.5px 普通描边
  hairlineBright: '#2A2D33', // 0.5px 强调描边

  // —— 心率区间 ——
  zone1: 'rgba(255,255,255,0.10)',
  zone2: 'rgba(0, 229, 168, 0.22)',
  zone3: 'rgba(0, 229, 168, 0.55)',
  zone4: 'rgba(255, 200, 100, 0.55)',
  zone5: 'rgba(255, 107, 61, 0.7)',

  // —— 配速色谱 (5 段，slow → fast) ——
  pace1: '#006B4E',
  pace2: '#00875F',
  pace3: '#00B488',
  pace4: '#00D49A',
  pace5: '#29F0BD',
} as const;

/* ============================================================
 * TYPOGRAPHY · 字体
 * ============================================================
 * 三族字体系统：Inter (英文 sans) + JetBrains Mono (数据/技术)
 * + Noto Sans SC (中文)。RN 默认字体不用，所有文字明确指定。
 *
 * 注意：iOS 上 Noto Sans SC 字号经常需要比英文大 1-2 px 才视觉等价。
 */
export const fonts = {
  // 字族
  sans: 'Inter',
  mono: 'JetBrains Mono',
  cn: 'Noto Sans SC',
  system: 'System', // fallback

  // 字重 (与 expo-font 加载的字重必须对应)
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
} as const;

/* ============================================================
 * SPACING · 间距
 * ============================================================
 * 4 的倍数。RN 没有 CSS gap 全部支持，多用 padding/margin。
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/* ============================================================
 * RADII · 圆角
 * ============================================================
 */
export const radii = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 14,
  pill: 999,
  capsule: 84,    // START 按钮高度的一半
} as const;

/* ============================================================
 * SHADOWS · 阴影
 * ============================================================
 * RN 阴影是 iOS-only (shadowColor / shadowOpacity / shadowRadius / shadowOffset)。
 * Android 用 elevation。我们做 iOS 优先，简化处理。
 */
export const shadows = {
  // 卡片悬浮
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  // 冷绿外发光（用于 CTA、活跃数据）
  glowAccent: {
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  // 金色发光（警示）
  glowGold: {
    shadowColor: colors.gold,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  // 心形红微光
  glowHeart: {
    shadowColor: colors.heart,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
} as const;

/* ============================================================
 * EASING · 动画曲线
 * ============================================================
 * cubic-bezier(.2, .8, .2, 1) 是设计系统的"主缓动"，类似 iOS 默认。
 */
export const easings = {
  // 主缓动 — 所有 hover/press/transition 用这个
  out: Easing.bezier(0.2, 0.8, 0.2, 1),
  inOut: Easing.bezier(0.4, 0, 0.2, 1),
  // 线性 — spinner / 扫描
  linear: Easing.linear,
} as const;

/* ============================================================
 * DURATIONS · 动画时长 (ms)
 * ============================================================
 */
export const durations = {
  fast: 150,
  base: 200,
  medium: 300,
  slow: 500,
  // 周期性
  pulseLive: 1500,    // 红点呼吸
  pulseSoft: 2000,    // 软呼吸
  glowBreathe: 4200,  // 配速光晕呼吸
  heartbeat: 1100,    // 心跳 lub-dub
  scanArc: 7000,      // START 按钮扫描弧
  particle: 5500,     // 路线粒子
} as const;

/* ============================================================
 * 常量字符串 · 文案 token
 * ============================================================
 * 所有 mock 数据集中此处，方便后续替换为真实数据
 */
export const mockData = {
  user: {
    name: '刘宇',
    handle: '@liuyu',
  },
  today: {
    readiness: 82,
    readinessDelta: 6,
    strain: 14.2,
    strainStatus: '7 日 · 偏高',
    sleep: 87,
    sleepHours: '7h 24m',
    sleepDelta: 4,
    aiSuggestion: '恢复良好但负荷偏高，建议做轻松跑而非节奏跑。',
  },
  weather: {
    city: '上海',
    condition: '晴',
    temp: 18,
    wind: '微风',
    suitability: '适合跑步',
  },
  lastRun: {
    date: '5月3日',
    distance: 6.2,
    pace: "5'34\"",
  },
  // 14 天活力点数据 (相对值 0-1, 越大越亮)
  timeline: [0.4, 0.5, 0.6, 0.4, 0.5, 0.7, 0.6, 0.5, 0.8, 0.6, 0.7, 0.5, 0.6],
} as const;
