"use client";

import { useMemo } from "react";
import { toISODate } from "@/lib/mamalog";
import { addDaysToISO } from "@/lib/dates";
import type { TaskDueKind } from "@/lib/task-form-types";

type DueDateSelectorProps = {
  dueKind: TaskDueKind;
  onDueKind: (k: TaskDueKind) => void;
  pickedISO: string;
  onPickedISO: (iso: string) => void;
};

const CHIPS: { id: TaskDueKind; label: string }[] = [
  { id: "today", label: "今日" },
  { id: "tomorrow", label: "明日" },
  { id: "pick", label: "日付を選ぶ" },
  { id: "none", label: "期限なし" },
];

export function DueDateSelector({ dueKind, onDueKind, pickedISO, onPickedISO }: DueDateSelectorProps) {
  const todayISO = useMemo(() => toISODate(new Date()), []);

  return (
    <section className="rounded-[18px] border border-black/[0.06] bg-white p-4 shadow-[0_8px_28px_-12px_rgba(58,42,42,0.12)]">
      <p className="text-[11px] font-bold tracking-[0.06em] text-mamalog-muted">期限</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {CHIPS.map((c) => {
          const on = dueKind === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                onDueKind(c.id);
                if (c.id === "pick" && !pickedISO) onPickedISO(todayISO);
              }}
              className={`inline-flex h-9 items-center justify-center rounded-full px-3.5 text-[12.5px] font-semibold whitespace-nowrap transition active:scale-[0.97] ${
                on
                  ? "bg-[#FF7F91] text-white shadow-md shadow-[#FF7F91]/22"
                  : "bg-[#FFF9F7] text-mamalog-text ring-1 ring-black/[0.06] hover:bg-[#FFE8E8]/60"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      {dueKind === "pick" ? (
        <div className="mt-3 rounded-2xl bg-[#FFF9F7] px-3 py-3 ring-1 ring-black/[0.05]">
          <label htmlFor="duePick" className="text-[10px] font-bold text-mamalog-muted">
            日付を選択
          </label>
          <input
            id="duePick"
            type="date"
            value={pickedISO}
            onChange={(e) => onPickedISO(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2.5 text-[14px] font-semibold text-mamalog-text outline-none focus:border-[#FF7F91]/45 focus:ring-2 focus:ring-[#FFE8E8]"
          />
        </div>
      ) : null}
    </section>
  );
}

/** 期限計算用（親で保存時に利用） */
export function resolveDueISO(kind: TaskDueKind, pickedISO: string | null): string | null {
  const today = toISODate(new Date());
  if (kind === "today") return today;
  if (kind === "tomorrow") return addDaysToISO(today, 1);
  if (kind === "pick") return pickedISO;
  return null;
}
