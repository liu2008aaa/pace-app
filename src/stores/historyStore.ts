/**
 * historyStore · 跑步历史 + AsyncStorage 持久化
 *
 * 用 zustand persist 中间件自动同步到 AsyncStorage，
 * key = '@pace/history'。每次 endRun 会调用 addRun 写入。
 *
 * 数据结构 Run：
 *   - id: 唯一标识（startedAt 戳）
 *   - startedAt / duration / distance / avgPace / avgHR
 *   - splits: 每公里配速数组（v0.3 由 endRun mock 生成）
 *   - type: 'outdoor' | 'indoor' | 'cycling'
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Run {
  id: string;
  startedAt: number;     // ms epoch
  duration: number;      // 秒（活跃跑步时间）
  distance: number;      // 米
  avgPace: number;       // 秒/公里
  avgHR: number;         // BPM
  splits: number[];      // 每公里配速秒数
  type: 'outdoor' | 'indoor' | 'cycling';
  notes?: string;
}

interface HistoryStore {
  /** 所有跑步记录，倒序（最新在最前） */
  runs: Run[];
  /** 添加一条新记录 */
  addRun: (run: Run) => void;
  /** 给某条记录加备注 */
  updateNotes: (id: string, notes: string) => void;
  /** 删除某条记录 */
  deleteRun: (id: string) => void;
  /** 清空全部（调试用） */
  clear: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      runs: [],

      addRun: (run) =>
        set((s) => ({
          runs: [run, ...s.runs],
        })),

      updateNotes: (id, notes) =>
        set((s) => ({
          runs: s.runs.map((r) => (r.id === id ? { ...r, notes } : r)),
        })),

      deleteRun: (id) =>
        set((s) => ({
          runs: s.runs.filter((r) => r.id !== id),
        })),

      clear: () => set({ runs: [] }),
    }),
    {
      name: '@pace/history',
      storage: createJSONStorage(() => AsyncStorage),
      // 只持久化 runs 字段，actions 不持久化
      partialize: (state) => ({ runs: state.runs }),
    }
  )
);

/* ============================================================
 * 工具：获取最近一次跑步
 * ============================================================ */
export function selectLatestRun(state: HistoryStore): Run | null {
  return state.runs[0] ?? null;
}

/* ============================================================
 * 工具：根据真实 distance + duration + avgPace 生成模拟分段配速
 * ============================================================
 * v0.3 临时方案：跑步太短可能只有几百米，
 * 为了让 PostRun 的配速曲线"好看"，固定生成 5 段递减配速（最后一段最快）。
 */
export function generateMockSplits(distanceMeters: number): number[] {
  const km = Math.max(1, Math.ceil(distanceMeters / 1000));
  const target = 5; // 始终展示 5 段（不论实际跑了多远）
  const splits: number[] = [];
  // 模拟一个"前慢后快"的配速曲线
  const baseValues = [334, 318, 312, 308, 302]; // 5'34" → 5'02"
  for (let i = 0; i < target; i++) {
    splits.push(baseValues[i]);
  }
  return splits;
}
