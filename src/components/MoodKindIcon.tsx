"use client";

import type { MoodKind } from "@/lib/mamalog";

type MoodKindIconProps = {
  mood: MoodKind;
  /** img 用（iconSrc があるとき） */
  imgClassName: string;
  /** emoji 用のラッパーに付与（iconSrc がないときはそのまま表示） */
  emojiClassName?: string;
};

/** 気持ちの絵文字またはカスタム画像（iconSrc がある項目）。画像は正円にクロップ */
export function MoodKindIcon({ mood, imgClassName, emojiClassName }: MoodKindIconProps) {
  if (mood.iconSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mood.iconSrc}
        alt=""
        className={`shrink-0 rounded-full object-cover ${imgClassName}`}
        draggable={false}
      />
    );
  }
  return <span className={emojiClassName}>{mood.emoji}</span>;
}
