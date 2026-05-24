"use client";

import type { MoodId, MoodKind } from "@/lib/mamalog";
import { MoodKindIcon } from "./MoodKindIcon";

type MoodSelectorProps = {
  moods: MoodKind[];
  selectedId: MoodId | null;
  onSelect: (id: MoodId) => void;
};

export function MoodSelector({ moods, selectedId, onSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {moods.map((m) => {
        const on = selectedId === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            aria-pressed={on}
            className="flex flex-col items-center gap-1.5 transition active:scale-95"
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl transition"
              style={{
                backgroundColor: m.bgColor,
                boxShadow: on
                  ? `0 0 0 3px ${m.color}, 0 4px 10px -2px ${m.color}77`
                  : "0 0 0 1px rgba(0,0,0,0.05)",
              }}
            >
              <MoodKindIcon
                mood={m}
                imgClassName="pointer-events-none h-10 w-10 select-none"
                emojiClassName="text-2xl leading-none"
              />
            </span>
            <span
              className="text-[10.5px] font-bold tracking-tight"
              style={{ color: on ? m.textColor : "#9A8A8A" }}
            >
              {m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
