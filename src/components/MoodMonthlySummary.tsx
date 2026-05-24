"use client";

import { useMemo } from "react";
import { Card } from "./Card";
import { MoodKindIcon } from "./MoodKindIcon";
import { MOOD_KINDS, type MoodEntry, type MoodId } from "@/lib/mamalog";

type MoodMonthlySummaryProps = {
  year: number;
  monthIndex: number;
  entries: MoodEntry[];
};

const MESSAGES: Record<MoodId, string> = {
  happy: "今月はうれしい日がたくさんあったね♪その調子で過ごそう。",
  normal: "今月はおだやかに過ごせていそう。少しの「いつも」が、いちばんの宝物。",
  sad: "今月は少ししんどい日が多かったかも。深呼吸してね。話したくなったら、またここで吐き出そう。",
  angry: "今月は心がザワザワしがちだったかな。自分のペースを大切にね。",
  tired: "今月は少し疲れ気味かも。ちゃんと休む日も作ってね。",
};

export function MoodMonthlySummary({ year, monthIndex, entries }: MoodMonthlySummaryProps) {
  const inMonth = useMemo(
    () =>
      entries.filter((e) => {
        const [y, m] = e.dateISO.split("-").map(Number);
        return y === year && m - 1 === monthIndex;
      }),
    [entries, year, monthIndex],
  );

  const counts = useMemo(() => {
    const c: Record<MoodId, number> = { happy: 0, normal: 0, sad: 0, angry: 0, tired: 0 };
    inMonth.forEach((e) => {
      c[e.moodId] += 1;
    });
    return c;
  }, [inMonth]);

  const topId: MoodId | null = useMemo(() => {
    let best: MoodId | null = null;
    let bestCount = 0;
    (Object.keys(counts) as MoodId[]).forEach((k) => {
      if (counts[k] > bestCount) {
        best = k;
        bestCount = counts[k];
      }
    });
    return best;
  }, [counts]);

  const top = topId ? MOOD_KINDS.find((m) => m.id === topId) : undefined;

  return (
    <Card className="!px-5 !py-5">
      <h3 className="text-[12px] font-bold text-mamalog-muted">{monthIndex + 1}月のふりかえり</h3>

      <div className="mt-4 flex items-center gap-4">
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full text-3xl"
          style={{ backgroundColor: top?.bgColor ?? "#F4F2F1" }}
        >
          {top ? (
            <MoodKindIcon
              mood={top}
              imgClassName="pointer-events-none h-12 w-12 select-none"
              emojiClassName="text-3xl leading-none"
            />
          ) : null}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-mamalog-muted">いちばん多かった気持ち</p>
          <p className="text-[18px] font-bold" style={{ color: top?.textColor ?? "#3A2A2A" }}>
            {top?.label ?? "ーー"}
          </p>
          <p className="mt-0.5 text-[11px] text-mamalog-muted">
            記録した日：<span className="font-bold tabular-nums text-mamalog-text">{inMonth.length}</span>日
          </p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-5 gap-1">
        {MOOD_KINDS.map((m) => (
          <li key={m.id} className="flex flex-col items-center gap-0.5">
            <span
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-base"
              style={{ backgroundColor: m.bgColor }}
            >
              <MoodKindIcon
                mood={m}
                imgClassName="pointer-events-none h-6 w-6 select-none"
                emojiClassName="text-base leading-none"
              />
            </span>
            <span className="text-[10.5px] font-bold tabular-nums" style={{ color: m.textColor }}>
              {counts[m.id]}
            </span>
          </li>
        ))}
      </ul>

      {topId ? (
        <p className="mt-5 rounded-2xl bg-mamalog-sub/30 px-4 py-3 text-[12.5px] leading-relaxed text-mamalog-text">
          {MESSAGES[topId]}
        </p>
      ) : (
        <p className="mt-5 rounded-2xl bg-mamalog-sub/30 px-4 py-3 text-[12.5px] leading-relaxed text-mamalog-muted">
          まだ記録がありません。今日の気持ちから記録してみてね。
        </p>
      )}
    </Card>
  );
}
