/**
 * runStore · 跑步状态机 + 模拟计时器
 *
 * 管理整个跑步会话的全局状态，跨屏幕（PreRun → InRun → Paused → 结束）共享。
 *
 * 核心状态机:
 *   idle → preRun → running → (paused → running)* → ended → idle
 *
 * 模拟模式 (v0.2):
 *   - 不接 GPS / HealthKit
 *   - 用 setInterval 每秒虚拟推进配速 + 距离 + 心率
 *   - 配速基线 5'30"/km，± 15s 噪声
 *   - 心率 145-160 BPM 随机
 *
 * 真实模式 (后续):
 *   - 接入 expo-location 真实 GPS
 *   - 接入 HealthKit / Apple Watch 真实心率
 *   - 替换 _tick() 为传感器订阅
 */

import { create } from 'zustand';
import { useHistoryStore, generateMockSplits, type Run } from './historyStore';

/** 跑步会话状态 */
export type RunState = 'idle' | 'preRun' | 'running' | 'paused' | 'ended';

/** runStore 暴露的字段 + actions */
interface RunStore {
  /** 当前状态 */
  state: RunState;

  /** 跑步开始时间戳 (ms)，仅 running/paused/ended 期间有值 */
  startedAt: number | null;
  /** 进入 paused 的时间戳 */
  pausedAt: number | null;
  /** 累计暂停时长 (ms)，用于计算实际跑步时间 */
  totalPausedDuration: number;

  /** 已跑距离 (米) */
  distance: number;
  /** 已跑时长 (秒，仅活跃跑步时间) */
  duration: number;
  /** 当前瞬时配速 (秒/公里) */
  pace: number;
  /** 当前心率 (BPM) */
  heartRate: number;

  // —— Actions ——
  /** 进入跑前预热（倒数过程中） */
  enterPreRun: () => void;
  /** 倒数完成，正式开始跑步 */
  startRun: () => void;
  /** 长按暂停 */
  pauseRun: () => void;
  /** 从暂停恢复 */
  resumeRun: () => void;
  /** 结束跑步（写入历史，下一步可保存到 AsyncStorage） */
  endRun: () => void;
  /** 完全重置回 idle */
  reset: () => void;

  /** 内部：每秒推进一步（仅供 setInterval 调用） */
  _tick: () => void;
}

/* ============================================================
 * 模拟参数 — 后续接真实传感器时替换为传感器订阅
 * ============================================================ */
const TARGET_PACE_SEC_PER_KM = 330; // 5'30"/km 基线
const PACE_NOISE_RANGE = 30;        // ± 15s 噪声
const HR_BASE = 145;                // 心率基线
const HR_RANGE = 16;                // 心率波动 145-160

/** 模块级 interval handle（外部不可见） */
let tickInterval: ReturnType<typeof setInterval> | null = null;

function clearTick() {
  if (tickInterval !== null) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

export const useRunStore = create<RunStore>((set, get) => ({
  state: 'idle',
  startedAt: null,
  pausedAt: null,
  totalPausedDuration: 0,
  distance: 0,
  duration: 0,
  pace: 0,
  heartRate: 0,

  enterPreRun: () => {
    clearTick();
    set({
      state: 'preRun',
      startedAt: null,
      pausedAt: null,
      totalPausedDuration: 0,
      distance: 0,
      duration: 0,
      pace: 0,
      heartRate: 0,
    });
  },

  startRun: () => {
    clearTick();
    set({
      state: 'running',
      startedAt: Date.now(),
      pausedAt: null,
      totalPausedDuration: 0,
      distance: 0,
      duration: 0,
      pace: TARGET_PACE_SEC_PER_KM,
      heartRate: HR_BASE,
    });
    tickInterval = setInterval(() => get()._tick(), 1000);
  },

  pauseRun: () => {
    clearTick();
    set({ state: 'paused', pausedAt: Date.now() });
  },

  resumeRun: () => {
    clearTick();
    set((s) => ({
      state: 'running',
      totalPausedDuration:
        s.totalPausedDuration + (Date.now() - (s.pausedAt ?? Date.now())),
      pausedAt: null,
    }));
    tickInterval = setInterval(() => get()._tick(), 1000);
  },

  endRun: () => {
    clearTick();
    const s = get();
    // 只有当跑步真正发生过（距离 > 0）才写入历史
    if (s.distance > 0 && s.duration > 0) {
      const avgPace = (s.duration / (s.distance / 1000)); // 秒/公里
      const run: Run = {
        id: String(s.startedAt ?? Date.now()),
        startedAt: s.startedAt ?? Date.now(),
        duration: s.duration,
        distance: s.distance,
        avgPace,
        avgHR: s.heartRate || 152,
        splits: generateMockSplits(s.distance),
        type: 'outdoor',
      };
      useHistoryStore.getState().addRun(run);
    }
    set({ state: 'ended' });
  },

  reset: () => {
    clearTick();
    set({
      state: 'idle',
      startedAt: null,
      pausedAt: null,
      totalPausedDuration: 0,
      distance: 0,
      duration: 0,
      pace: 0,
      heartRate: 0,
    });
  },

  _tick: () => {
    set((s) => {
      // 配速: 在基线 ± 噪声内浮动
      const noise = (Math.random() - 0.5) * PACE_NOISE_RANGE;
      const currentPace = TARGET_PACE_SEC_PER_KM + noise;
      // 距离: 1 秒能跑多少米 = 1000m / 配速秒数
      const distancePerSec = 1000 / currentPace;
      // 心率: 在基线 + 0~range 浮动
      const hr = HR_BASE + Math.floor(Math.random() * HR_RANGE);

      return {
        duration: s.duration + 1,
        distance: s.distance + distancePerSec,
        pace: currentPace,
        heartRate: hr,
      };
    });
  },
}));
