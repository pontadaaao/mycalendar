"use client";

import type { TaskRepeatKind } from "@/lib/task-form-types";

type RepeatSelectorProps = {
  value: TaskRepeatKind;
  onChange: (v: TaskRepeatKind) => void;
};

const OPTIONS: { id: TaskRepeatKind; label: string }[] = [
  { id: "none", label: "なし" },
  { id: "daily", label: "毎日" },
  { id: "weekly", label: "毎週" },
  { id: "monthly", label: "毎月" },
];

export function RepeatSelector({ value, onChange }: RepeatSelectorProps) {
  return (
    <section className="rounded-[18px] border border-black/[0.06] bg-white p-4 shadow-[0_8px_28px_-12px_rgba(58,42,42,0.12)]">
      <p className="text-[11px] font-bold tracking-[0.06em] text-mamalog-muted">繰り返し</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {OPTIONS.map((o) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.id)}
              className={`rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition active:scale-[0.97] ${
                on
                  ? "bg-[#FF7F91] text-white shadow-md shadow-[#FF7F91]/22"
                  : "bg-[#FFF9F7] text-mamalog-text ring-1 ring-black/[0.06] hover:bg-[#FFE8E8]/60"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
