/**
 * Share · Phone 05 分享卡选择
 *
 * 入口：从 PostRun 「分享」按钮跳来。
 * 顶部 close 按钮回 PostRun。
 *
 * 2x2 gallery 4 种 mini 风格 + 当前选中 + 底部 3 操作按钮。
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ShareMini, type ShareVariant } from '@/src/components/ShareMini';
import { useRunStore } from '@/src/stores/runStore';
import { formatPace, formatDuration, formatDistance } from '@/src/lib/format';
import { colors, fonts } from '@/src/theme';

const VARIANT_NAMES: Record<ShareVariant, string> = {
  classic: '经典',
  minimal: '极简',
  poster: '海报',
  data: '数据',
};

export default function Share() {
  const router = useRouter();
  const distance = useRunStore((s) => s.distance);
  const duration = useRunStore((s) => s.duration);
  const heartRate = useRunStore((s) => s.heartRate);

  const [active, setActive] = useState<ShareVariant>('classic');

  const avgPace = distance > 0 ? duration / (distance / 1000) : 0;
  const distanceText = formatDistance(distance);
  const durationText = formatDuration(duration);
  const paceText = formatPace(avgPace);

  const now = new Date();
  const date = `${String(now.getMonth() + 1).padStart(2, '0')}·${String(now.getDate()).padStart(2, '0')}`;

  const sharedProps = {
    distance: distanceText,
    duration: durationText,
    pace: paceText,
    hr: heartRate || 152,
    date,
  };

  const handleSelect = (variant: ShareVariant) => {
    Haptics.selectionAsync().catch(() => {});
    setActive(variant);
  };

  const handleClose = () => {
    router.back();
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert('已保存', `${VARIANT_NAMES[active]} 样式已保存到相册（v0.4 接 expo-media-library 真实写入）`);
  };

  const handleCopy = () => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert('已复制', '图片已复制到剪贴板（v0.4 真实集成）');
  };

  const handleShare = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert('分享', `分享 ${VARIANT_NAMES[active]} 样式到... (v0.4 接 expo-sharing)`);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>分享配图</Text>
          <Text style={styles.close} onPress={handleClose}>关闭 ✕</Text>
        </View>

        {/* Section title */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>选择样式</Text>
            <Text style={styles.sectionSubtitle}>SELECT STYLE · 4 / 4</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.sectionRight}>
              {date.replace('·', '月')}日 · {distanceText} km
            </Text>
            <Text style={styles.sectionRightSub}>9 : 16 · 1080×1920</Text>
          </View>
        </View>

        {/* 2x2 gallery */}
        <View style={styles.gallery}>
          <View style={styles.galleryRow}>
            <ShareMini
              variant="classic"
              active={active === 'classic'}
              onPress={() => handleSelect('classic')}
              {...sharedProps}
            />
            <View style={{ width: 8 }} />
            <ShareMini
              variant="minimal"
              active={active === 'minimal'}
              onPress={() => handleSelect('minimal')}
              {...sharedProps}
            />
          </View>
          <View style={{ height: 8 }} />
          <View style={styles.galleryRow}>
            <ShareMini
              variant="poster"
              active={active === 'poster'}
              onPress={() => handleSelect('poster')}
              {...sharedProps}
            />
            <View style={{ width: 8 }} />
            <ShareMini
              variant="data"
              active={active === 'data'}
              onPress={() => handleSelect('data')}
              {...sharedProps}
            />
          </View>
        </View>

        {/* Selected info */}
        <View style={styles.selectedRow}>
          <View style={styles.selectedLeft}>
            <Text style={styles.selectedPrefix}>已选</Text>
            <Text style={styles.selectedName}>{VARIANT_NAMES[active]}</Text>
            <Text style={styles.selectedEn}>/ {active.charAt(0).toUpperCase() + active.slice(1)}</Text>
          </View>
          <View style={styles.previewBtn}>
            <Text style={styles.previewBtnText}>预览全屏</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <View style={[styles.btn, styles.btnSecondary]} onTouchEnd={handleSave}>
            <Text style={styles.btnSecondaryText}>保存</Text>
          </View>
          <View style={[styles.btn, styles.btnSecondary]} onTouchEnd={handleCopy}>
            <Text style={styles.btnSecondaryText}>复制</Text>
          </View>
          <View style={[styles.btn, styles.btnPrimary]} onTouchEnd={handleShare}>
            <Text style={styles.btnPrimaryText}>分享</Text>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.cn,
    fontSize: 11,
    color: '#fff',
    letterSpacing: 2,
  },
  close: {
    fontFamily: fonts.cn,
    fontSize: 11,
    color: colors.text3,
    letterSpacing: 1.7,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: fonts.cn,
    fontSize: 13,
    color: '#fff',
    letterSpacing: 0.5,
    fontWeight: fonts.weights.medium,
  },
  sectionSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 7.5,
    color: colors.text3,
    letterSpacing: 1.95,
    marginTop: 2,
  },
  sectionRight: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.text2,
    letterSpacing: 0.5,
  },
  sectionRightSub: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.text4,
    letterSpacing: 1,
    marginTop: 2,
  },

  gallery: {
    width: '100%',
  },
  galleryRow: {
    flexDirection: 'row',
  },

  selectedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 12,
  },
  selectedLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  selectedPrefix: {
    fontFamily: fonts.cn,
    fontSize: 11,
    color: colors.text2,
  },
  selectedName: {
    fontFamily: fonts.cn,
    fontSize: 13,
    fontWeight: fonts.weights.semibold,
    color: colors.accent,
  },
  selectedEn: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.text4,
    letterSpacing: 0.5,
  },
  previewBtn: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 229, 168, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 229, 168, 0.25)',
  },
  previewBtnText: {
    fontFamily: fonts.cn,
    fontSize: 9.5,
    color: colors.accent,
    letterSpacing: 0.6,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondary: {
    backgroundColor: colors.bgElev,
    borderWidth: 0.5,
    borderColor: colors.hairlineBright,
  },
  btnSecondaryText: {
    fontFamily: fonts.cn,
    fontSize: 11,
    color: '#fff',
  },
  btnPrimary: {
    backgroundColor: colors.accent,
  },
  btnPrimaryText: {
    fontFamily: fonts.cn,
    fontSize: 11,
    fontWeight: fonts.weights.bold,
    color: '#001A14',
  },
});
