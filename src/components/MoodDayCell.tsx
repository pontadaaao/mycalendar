"use client";

import type { MoodKind } from "@/lib/mamalog";
import { MoodKindIcon } from "./MoodKindIcon";

type MoodDayCellProps = {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  mood?: MoodKind;
  onClick: () => void;
};

export function MoodDayCell({ date, isSelected, isToday, mood, onClick }: MoodDayCellProps) {
  const dow = date.getDay();
  const baseColor = mood?.textColor ?? (dow === 0 ? "#FF7F91" : dow === 6 ? "#5C8FE0" : "#3A2A2A");
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-[52px] w-full items-center justify-center transition ${
        isSelected ? "scale-[1.08]" : ""
      }`}
    >
      <span
        className={`flex h-[46px] w-[46px] flex-col items-center justify-center rounded-2xl transition ${
          isSelected ? "shadow-[0_6px_14px_-4px_rgba(58,42,42,0.25)]" : ""
        } ${isToday ? "ring-2 ring-mamalog-main ring-offset-1 ring-offset-white" : ""}`}
        style={{
          backgroundColor: mood ? mood.bgColor : "#FFFFFF",
          border: !mood && !isToday ? "1px solid rgba(0,0,0,0.05)" : "none",
        }}
      >
        <span className="text-[12px] font-bold leading-none" style={{ color: baseColor }}>
          {date.getDate()}
        </span>
        <span className="mt-1 flex h-[14px] items-center justify-center leading-none" aria-hidden>
          {mood ? (
            <MoodKindIcon
              mood={mood}
              imgClassName="pointer-events-none h-[14px] w-[14px] select-none"
              emojiClassName="text-[12px] leading-none"
            />
          ) : (
            <span className="opacity-0">·</span>
          )}
        </span>
      </span>
    </button>
  );
}
