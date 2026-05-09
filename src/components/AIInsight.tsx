/**
 * AIInsight · AI 解读卡片
 *
 * Phone 04 顶部那条冷绿描边、半透明渐变底的 ✦ 引言卡。
 * 可点击（Pressable），将来跳到 /coach 带上下文。
 *
 * 还有一个底部的 quote-toolbar（↻ 换一句 / ✏ 编辑 / AI 1/3）—
 * 第一版只放 → 与教练讨论 link，工具条留到下个迭代。
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, fonts } from '@/src/theme';

interface Props {
  /** AI 引言主体（可包含粗体高亮） */
  text: string;
  /** 高亮关键词（在 text 中出现的话变成冷绿强调） */
  highlight?: string;
  /** 点击事件 */
  onPress?: () => void;
}

export function AIInsight({ text, highlight, onPress }: Props) {
  // 简易高亮：split text by highlight，中间用 accent 色
  let parts: { text: string; isHighlight: boolean }[];
  if (highlight && text.includes(highlight)) {
    const idx = text.indexOf(highlight);
    parts = [
      { text: text.slice(0, idx), isHighlight: false },
      { text: highlight, isHighlight: true },
      { text: text.slice(idx + highlight.length), isHighlight: false },
    ];
  } else {
    parts = [{ text, isHighlight: false }];
  }

  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* 顶部主行：✦ + text */}
      <View style={styles.row}>
        <Text style={styles.star}>✦</Text>
        <Text style={styles.body}>
          {parts.map((p, i) =>
            p.isHighlight ? (
              <Text key={i} style={styles.highlight}>
                {p.text}
              </Text>
            ) : (
              <Text key={i}>{p.text}</Text>
            )
          )}
        </Text>
      </View>

      {/* 底部：与教练讨论 link */}
      <View style={styles.coachLink}>
        <Text style={styles.coachArrow}>→</Text>
        <Text style={styles.coachText}>与教练继续讨论这次跑步</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 229, 168, 0.04)', // approximate gradient base
    borderWidth: 0.5,
    borderColor: 'rgba(0, 229, 168, 0.22)',
    borderRadius: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  star: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.accent,
    lineHeight: 18,
  },
  body: {
    flex: 1,
    fontFamily: fonts.cn,
    fontSize: 11,
    color: colors.text1,
    lineHeight: 17,
  },
  highlight: {
    color: colors.accent,
    fontWeight: fonts.weights.semibold,
  },
  coachLink: {
    marginTop: 8,
    paddingTop: 7,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 229, 168, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  coachArrow: {
    color: colors.accent,
    fontFamily: fonts.cn,
    fontSize: 10,
  },
  coachText: {
    color: colors.accent,
    fontFamily: fonts.cn,
    fontSize: 9.5,
    letterSpacing: 0.6,
  },
});
