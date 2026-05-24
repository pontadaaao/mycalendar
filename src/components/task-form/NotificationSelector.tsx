"use client";

import type { TaskNotificationKind } from "@/lib/task-form-types";

type NotificationSelectorProps = {
  value: TaskNotificationKind;
  onChange: (v: TaskNotificationKind) => void;
  timeValue: string;
  onTimeChange: (t: string) => void;
};

const OPTIONS: { id: TaskNotificationKind; label: string }[] = [
  { id: "none", label: "なし" },
  { id: "same_day", label: "当日" },
  { id: "day_before", label: "1日前" },
  { id: "time", label: "時間指定" },
];

export function NotificationSelector({
  value,
  onChange,
  timeValue,
  onTimeChange,
}: NotificationSelectorProps) {
  return (
    <section className="rounded-[18px] border border-black/[0.06] bg-white p-4 shadow-[0_8px_28px_-12px_rgba(58,42,42,0.12)]">
      <p className="text-[11px] font-bold tracking-[0.06em] text-mamalog-muted">通知</p>
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
      {value === "time" ? (
        <div className="mt-3 rounded-2xl bg-[#FFF9F7] px-3 py-3 ring-1 ring-black/[0.05]">
          <label htmlFor="notifyTime" className="text-[10px] font-bold text-mamalog-muted">
            通知時刻
          </label>
          <input
            id="notifyTime"
            type="time"
            value={timeValue}
            onChange={(e) => onTimeChange(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2.5 text-[14px] font-semibold text-mamalog-text outline-none focus:border-[#FF7F91]/45 focus:ring-2 focus:ring-[#FFE8E8]"
          />
        </div>
      ) : null}
    </section>
  );
}
