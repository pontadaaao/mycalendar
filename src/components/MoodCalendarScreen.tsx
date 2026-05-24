"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./Card";
import { PrimaryButton } from "./PrimaryButton";
import { MoodSelector } from "./MoodSelector";
import { MoodCalendarGrid } from "./MoodCalendarGrid";
import { MoodDetailCard } from "./MoodDetailCard";
import { MoodMonthlySummary } from "./MoodMonthlySummary";
import {
  MOOD_KINDS,
  PROTOTYPE_ANCHOR_ISO,
  type MoodEntry,
  type MoodId,
} from "@/lib/mamalog";
import { parseISOLocal, shiftMonthYear } from "@/lib/dates";

type MoodCalendarScreenProps = {
  entries: MoodEntry[];
  onSaveEntry: (entry: MoodEntry) => void;
};

function formatJpDate(dateISO: string): string {
  const d = parseISOLocal(dateISO);
  const wd = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日（${wd}）`;
}

export function MoodCalendarScreen({ entries, onSaveEntry }: MoodCalendarScreenProps) {
  const [selectedDateISO, setSelectedDateISO] = useState(PROTOTYPE_ANCHOR_ISO);
  const [cursor, setCursor] = useState(() => {
    const d = parseISOLocal(PROTOTYPE_ANCHOR_ISO);
    return { year: d.getFullYear(), monthIndex: d.getMonth() };
  });

  const existing = useMemo(
    () => entries.find((e) => e.dateISO === selectedDateISO),
    [entries, selectedDateISO],
  );

  const [editingMood, setEditingMood] = useState<MoodId | null>(existing?.moodId ?? null);
  const [editingMemo, setEditingMemo] = useState<string>(existing?.memo ?? "");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  /** 選択日が変わったら、フォームを既存エントリ／空に同期 */
  useEffect(() => {
    setEditingMood(existing?.moodId ?? null);
    setEditingMemo(existing?.memo ?? "");
    setSavedAt(null);
  }, [selectedDateISO, existing?.moodId, existing?.memo]);

  const inputCardRef = useRef<HTMLDivElement>(null);
  const isSelectedToday = selectedDateISO === PROTOTYPE_ANCHOR_ISO;

  function handleSave() {
    if (!editingMood) return;
    onSaveEntry({ dateISO: selectedDateISO, moodId: editingMood, memo: editingMemo.trim() });
    setSavedAt(selectedDateISO);
  }

  function handleEditFromDetail() {
    setSavedAt(null);
    inputCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function shiftMonth(delta: number) {
    const { year, monthIndex } = shiftMonthYear(cursor.year, cursor.monthIndex, delta);
    setCursor({ year, monthIndex });
  }

  return (
    <div className="flex flex-col gap-5 pb-12 pt-4">
      {/* 入力カード（選択日に対する記録） */}
      <div ref={inputCardRef}>
        <Card className="!px-5 !py-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-bold text-mamalog-text">
              {isSelectedToday ? "今日の気持ちは？" : `${formatJpDate(selectedDateISO)}の気持ちは？`}
            </h2>
            <span className="text-[11px] font-semibold text-mamalog-muted">
              {formatJpDate(selectedDateISO)}
            </span>
          </div>

          <div className="mt-5">
            <MoodSelector
              moods={MOOD_KINDS}
              selectedId={editingMood}
              onSelect={(id) => {
                setEditingMood(id);
                setSavedAt(null);
              }}
            />
          </div>

          <label htmlFor="moodMemo" className="mt-5 block text-[11px] font-semibold text-mamalog-muted">
            ひとことメモ（任意）
          </label>
          <textarea
            id="moodMemo"
            rows={2}
            value={editingMemo}
            onChange={(e) => {
              setEditingMemo(e.target.value);
              setSavedAt(null);
            }}
            placeholder="どんな一日だった？短くてもOK"
            className="mt-1.5 w-full resize-none rounded-xl border border-black/[0.06] bg-mamalog-sub/30 px-3 py-2.5 text-[13px] leading-relaxed text-mamalog-text caret-mamalog-main outline-none transition focus:border-mamalog-main/40 focus:bg-white"
          />

          {savedAt === selectedDateISO ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-mamalog-green/15 px-3 py-2 text-[12px] font-semibold text-[#3F7C4D]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mamalog-green text-white">
                ✓
              </span>
              {isSelectedToday ? "今日の気持ちを保存しました" : "気持ちを保存しました"}
            </div>
          ) : null}

          <PrimaryButton
            type="button"
            disabled={!editingMood}
            onClick={handleSave}
            className="mt-4 w-full py-3 text-[14px]"
          >
            保存する
          </PrimaryButton>
        </Card>
      </div>

      {/* 気持ちカレンダー */}
      <Card className="!px-3 !py-4">
        <div className="mb-2 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="先月"
            className="flex h-8 w-8 items-center justify-center rounded-full text-mamalog-muted hover:bg-mamalog-sub/40 hover:text-mamalog-text"
          >
            ‹
          </button>
          <p className="text-[15px] font-bold tracking-tight text-mamalog-text">
            {cursor.year}年{cursor.monthIndex + 1}月
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="来月"
            className="flex h-8 w-8 items-center justify-center rounded-full text-mamalog-muted hover:bg-mamalog-sub/40 hover:text-mamalog-text"
          >
            ›
          </button>
        </div>

        <MoodCalendarGrid
          year={cursor.year}
          monthIndex={cursor.monthIndex}
          todayISO={PROTOTYPE_ANCHOR_ISO}
          selectedDateISO={selectedDateISO}
          entries={entries}
          onSelectDate={setSelectedDateISO}
        />

        {/* 凡例 */}
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
          {MOOD_KINDS.map((m) => (
            <li key={m.id} className="inline-flex items-center gap-1 text-[10.5px] text-mamalog-muted">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              {m.label}
            </li>
          ))}
        </ul>
      </Card>

      {/* 選択日の詳細 */}
      <MoodDetailCard dateISO={selectedDateISO} entry={existing} onEdit={handleEditFromDetail} />

      {/* 月のふりかえり */}
      <MoodMonthlySummary year={cursor.year} monthIndex={cursor.monthIndex} entries={entries} />
    </div>
  );
}
