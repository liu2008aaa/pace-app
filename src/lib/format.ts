/**
 * 数据格式化工具
 *
 * 统一全 App 的数字 → 显示文本转换。
 */

/**
 * 配速秒数 → "5'24"" 格式
 * 输入 324 → 输出 "5'24""
 * 输入 0 / NaN → 输出 "—'—""
 */
export function formatPace(secondsPerKm: number): string {
  if (!secondsPerKm || !isFinite(secondsPerKm) || secondsPerKm <= 0) {
    return "—'—\"";
  }
  const min = Math.floor(secondsPerKm / 60);
  const sec = Math.floor(secondsPerKm % 60);
  return `${min}'${sec.toString().padStart(2, '0')}"`;
}

/**
 * 时长秒数 → "MM:SS" 或 "H:MM:SS"
 * 输入 1234 → "20:34"
 * 输入 5234 → "1:27:14"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * 距离米 → "0.42" / "5.42" 公里
 */
export function formatDistance(meters: number): string {
  if (!meters || meters < 0) return '0.00';
  const km = meters / 1000;
  return km.toFixed(2);
}

/**
 * 心率区间计算 (220 - age 的 %)
 * 默认 age = 30，max HR = 190
 * Z1: 50-60% Z2: 60-70% Z3: 70-80% Z4: 80-90% Z5: 90-100%
 *
 * 给定 BPM，返回 1-5 的区间值
 */
export function getHeartRateZone(bpm: number, maxHR = 190): number {
  if (!bpm || bpm <= 0) return 0;
  const pct = bpm / maxHR;
  if (pct < 0.5) return 0;
  if (pct < 0.6) return 1;
  if (pct < 0.7) return 2;
  if (pct < 0.8) return 3;
  if (pct < 0.9) return 4;
  return 5;
}

/**
 * BPM → marker 在 5 段 zone bar 上的相对位置 (0-1)
 * 用于 HRZoneBar 组件的 marker 定位
 */
export function getHeartRateMarkerPosition(bpm: number, maxHR = 190): number {
  if (!bpm || bpm <= 0) return 0;
  // 把 50% maxHR (Z1 起点) 映射到 0
  // 把 100% maxHR (Z5 终点) 映射到 1
  const start = 0.5 * maxHR;
  const end = maxHR;
  const clamped = Math.max(start, Math.min(end, bpm));
  return (clamped - start) / (end - start);
}
