"use client";

import type { TaskPriorityKind } from "@/lib/task-form-types";

type PrioritySelectorProps = {
  value: TaskPriorityKind;
  onChange: (v: TaskPriorityKind) => void;
};

const OPTIONS: { id: TaskPriorityKind; label: string; active: string; idle: string }[] = [
  {
    id: "low",
    label: "低",
    active: "bg-neutral-500 text-white shadow-md shadow-neutral-500/20",
    idle: "bg-neutral-100 text-neutral-600 ring-1 ring-black/[0.06] hover:bg-neutral-50",
  },
  {
    id: "normal",
    label: "普通",
    active: "bg-[#8EB8FF] text-white shadow-md shadow-[#8EB8FF]/25",
    idle: "bg-[#EEF4FF] text-[#4F6FAE] ring-1 ring-[#8EB8FF]/25 hover:bg-[#E4ECFF]",
  },
  {
    id: "high",
    label: "高",
    active: "bg-[#E85D75] text-white shadow-md shadow-[#E85D75]/25",
    idle: "bg-[#FFE8EC] text-[#C43D54] ring-1 ring-[#E85D75]/20 hover:bg-[#FFDDE3]",
  },
];

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <section className="rounded-[18px] border border-black/[0.06] bg-white p-4 shadow-[0_8px_28px_-12px_rgba(58,42,42,0.12)]">
      <p className="text-[11px] font-bold tracking-[0.06em] text-mamalog-muted">優先度</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {OPTIONS.map((o) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.id)}
              className={`rounded-full px-5 py-2 text-[12.5px] font-semibold transition active:scale-[0.97] ${on ? o.active : o.idle}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
