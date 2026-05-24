"use client";

import { TASK_FORM_PALETTE } from "@/lib/task-form-types";

type ColorPickerProps = {
  value: string;
  onChange: (hex: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {TASK_FORM_PALETTE.map((p) => {
        const on = value === p.hex;
        return (
          <button
            key={p.id}
            type="button"
            aria-label={p.label}
            aria-pressed={on}
            onClick={() => onChange(p.hex)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${
              on ? "ring-[3px] ring-[#FF7F91] ring-offset-2 ring-offset-white" : "ring-1 ring-black/[0.08]"
            }`}
            style={{ backgroundColor: p.hex }}
          >
            {on ? (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M5 10.5l3 3 7-7"
                  stroke="white"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
