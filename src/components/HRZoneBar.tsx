/**
 * HRZoneBar · 心率区间条
 *
 * Phone 03 的 5 段渐变水平条 + 当前位置发光圆点 marker。
 * 暂停状态时整体变暗 + marker 变金色。
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/src/theme';

interface Props {
  /** marker 在条上的相对位置 0-1 */
  position: number;
  /** 暂停状态：变暗 + marker 金色 */
  paused?: boolean;
  /** 区间标签文本 (Z3 · TEMPO 之类) */
  zoneLabel?: string;
}

export function HRZoneBar({ position, paused = false, zoneLabel }: Props) {
  const clamped = Math.max(0, Math.min(1, position));

  return (
    <View style={[styles.wrap, paused && styles.wrapPaused]}>
      {/* 顶部标签行 */}
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>心率区间</Text>
        <Text
          style={[
            styles.headerZone,
            paused && styles.headerZonePaused,
          ]}
        >
          {zoneLabel ?? 'Z3 · TEMPO'}
        </Text>
      </View>

      {/* 5 段渐变 bar */}
      <View style={styles.bar}>
        <View style={[styles.seg, { backgroundColor: colors.zone1 }]} />
        <View style={[styles.seg, { backgroundColor: colors.zone2 }]} />
        <View style={[styles.seg, { backgroundColor: colors.zone3 }]} />
        <View style={[styles.seg, { backgroundColor: colors.zone4 }]} />
        <View style={[styles.seg, { backgroundColor: colors.zone5 }]} />

        {/* Marker (发光圆点) */}
        <View
          style={[
            styles.marker,
            paused && styles.markerPaused,
            { left: `${clamped * 100}%` },
          ]}
        />
      </View>

      {/* 底部 Z1-Z5 标签 */}
      <View style={styles.footerRow}>
        {(['Z1', 'Z2', 'Z3', 'Z4', 'Z5'] as const).map((z) => (
          <Text key={z} style={styles.zoneTick}>
            {z}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  wrapPaused: {
    opacity: 0.55,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLabel: {
    fontFamily: fonts.cn,
    fontSize: 9,
    color: colors.text3,
    letterSpacing: 2,
  },
  headerZone: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 1.3,
  },
  headerZonePaused: {
    color: colors.text3,
  },
  bar: {
    height: 7,
    flexDirection: 'row',
    borderRadius: 3.5,
    overflow: 'visible',
    backgroundColor: 'rgba(255,255,255,0.03)',
    position: 'relative',
  },
  seg: {
    flex: 1,
  },
  marker: {
    position: 'absolute',
    top: 3.5,
    width: 14,
    height: 14,
    marginLeft: -7,
    marginTop: -7,
    borderRadius: 7,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    borderWidth: 2,
    borderColor: colors.bgApp,
  },
  markerPaused: {
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  zoneTick: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.text4,
    letterSpacing: 0.8,
  },
});
