"use client";

import { Card } from "./Card";
import { MoodKindIcon } from "./MoodKindIcon";
import { PrimaryButton } from "./PrimaryButton";
import { MOOD_KINDS, type MoodEntry } from "@/lib/mamalog";
import { parseISOLocal } from "@/lib/dates";

type MoodDetailCardProps = {
  dateISO: string;
  entry?: MoodEntry;
  onEdit: () => void;
};

function formatJpDate(dateISO: string): string {
  const d = parseISOLocal(dateISO);
  const wd = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日（${wd}）`;
}

export function MoodDetailCard({ dateISO, entry, onEdit }: MoodDetailCardProps) {
  const date = formatJpDate(dateISO);
  const mood = entry ? MOOD_KINDS.find((m) => m.id === entry.moodId) : undefined;

  return (
    <Card className="!px-5 !py-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-mamalog-text">{date}</h3>
        {mood ? (
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            style={{ backgroundColor: mood.bgColor, color: mood.textColor }}
          >
            記録済み
          </span>
        ) : (
          <span className="rounded-full bg-mamalog-sub/40 px-2.5 py-0.5 text-[11px] font-semibold text-mamalog-muted">
            未記録
          </span>
        )}
      </div>

      {entry && mood ? (
        <>
          <div className="mt-4 flex items-center gap-3">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-3xl"
              style={{ backgroundColor: mood.bgColor }}
            >
              <MoodKindIcon
                mood={mood}
                imgClassName="pointer-events-none h-11 w-11 select-none"
                emojiClassName="text-3xl leading-none"
              />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-mamalog-muted">気分</p>
              <p className="text-[15px] font-bold" style={{ color: mood.textColor }}>
                {mood.label}
              </p>
            </div>
          </div>
          {entry.memo ? (
            <div className="mt-4">
              <p className="text-[11px] font-semibold text-mamalog-muted">ひとことメモ</p>
              <p className="mt-1.5 rounded-xl bg-mamalog-sub/30 px-3 py-2.5 text-[13px] leading-relaxed text-mamalog-text">
                {entry.memo}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-4 rounded-xl bg-mamalog-sub/30 px-4 py-6 text-center text-[12.5px] text-mamalog-muted">
          この日の気持ちはまだ記録されていません
        </p>
      )}

      <PrimaryButton
        variant="soft"
        className="mt-5 w-full py-2.5 text-[13px]"
        onClick={onEdit}
      >
        この日の気持ちを編集
      </PrimaryButton>
    </Card>
  );
}
