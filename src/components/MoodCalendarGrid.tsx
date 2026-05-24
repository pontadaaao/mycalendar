"use client";

import { useMemo } from "react";
import { MoodDayCell } from "./MoodDayCell";
import { isoFromDate, monthMatrix, weekdaysJa } from "@/lib/dates";
import { MOOD_KINDS, type MoodEntry, type MoodKind } from "@/lib/mamalog";

type MoodCalendarGridProps = {
  year: number;
  monthIndex: number;
  selectedDateISO: string;
  entries: MoodEntry[];
  onSelectDate: (iso: string) => void;
};

const moodById: Record<string, MoodKind> = MOOD_KINDS.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, MoodKind>,
);

export function MoodCalendarGrid({
  year,
  monthIndex,
  selectedDateISO,
  entries,
  onSelectDate,
}: MoodCalendarGridProps) {
  const cells = monthMatrix(year, monthIndex);
  const weekdays = weekdaysJa();

  const entryByISO = useMemo(() => {
    const map: Record<string, MoodEntry> = {};
    entries.forEach((e) => {
      map[e.dateISO] = e;
    });
    return map;
  }, [entries]);

  return (
    <div>
      <div className="grid grid-cols-7 pb-2 text-center">
        {weekdays.map((wd, idx) => (
          <div
            key={wd}
            className={`text-[11px] font-bold ${
              idx === 0
                ? "text-mamalog-main/80"
                : idx === 6
                  ? "text-mamalog-blue/90"
                  : "text-mamalog-muted"
            }`}
          >
            {wd}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1.5">
        {cells.map((d, idx) => {
          if (!d) return <div key={`empty-${idx}`} className="h-[52px]" />;
          const iso = isoFromDate(d);
          const entry = entryByISO[iso];
          const mood = entry ? moodById[entry.moodId] : undefined;
          return (
            <MoodDayCell
              key={iso}
              date={d}
              isSelected={iso === selectedDateISO}
              mood={mood}
              onClick={() => onSelectDate(iso)}
            />
          );
        })}
      </div>
    </div>
  );
}
