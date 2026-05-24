"use client";

import { isoFromDate, monthMatrix, weekdaysJa } from "@/lib/dates";
import { PROTOTYPE_ANCHOR_ISO } from "@/lib/mamalog";

type CalendarMonthProps = {
  year: number;
  monthIndex: number;
  selectedDateISO: string;
  /** 日付ISOごとに表示するドット色（最大3色まで描画） */
  dotsByDate: Record<string, string[]>;
  onPickDate: (iso: string) => void;
};

export function CalendarMonth({
  year,
  monthIndex,
  selectedDateISO,
  dotsByDate,
  onPickDate,
}: CalendarMonthProps) {
  const cells = monthMatrix(year, monthIndex);
  const weekdays = weekdaysJa();

  return (
    <div className="px-1">
      <div className="grid grid-cols-7 pb-1 pt-0.5 text-center">
        {weekdays.map((wd, idx) => (
          <div
            key={wd}
            className={`text-[11px] font-bold ${
              idx === 0 ? "text-mamalog-main/80" : idx === 6 ? "text-mamalog-blue/90" : "text-mamalog-muted"
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 pt-0.5">
        {cells.map((d, idx) => {
          if (!d) {
            return <div key={`empty-${idx}`} className="h-10" />;
          }

          const iso = isoFromDate(d);
          const selected = iso === selectedDateISO;
          const colors = (dotsByDate[iso] ?? []).slice(0, 3);
          const isToday = iso === PROTOTYPE_ANCHOR_ISO;
          const dow = d.getDay();

          return (
            <button
              type="button"
              key={iso}
              onClick={() => onPickDate(iso)}
              className="group flex flex-col items-center gap-0.5 focus:outline-none"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold transition ${
                  selected
                    ? "bg-mamalog-main text-white shadow-[0_4px_10px_-2px_rgba(255,127,145,0.5)]"
                    : isToday
                      ? "bg-mamalog-main/10 text-mamalog-main"
                      : dow === 0
                        ? "text-mamalog-main/80 group-hover:bg-mamalog-sub/40"
                        : dow === 6
                          ? "text-mamalog-blue/90 group-hover:bg-mamalog-sub/40"
                          : "text-mamalog-text group-hover:bg-mamalog-sub/40"
                }`}
              >
                {d.getDate()}
              </span>
              <span
                aria-hidden
                className="flex h-1.5 items-center justify-center gap-0.5"
              >
                {colors.map((c, i) => (
                  <span
                    key={`${iso}-${i}`}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarMonthHeader(props: {
  year: number;
  monthIndex: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const title = `${props.year}年${props.monthIndex + 1}月`;
  return (
    <div className="flex items-center justify-center gap-6 px-1 pb-0.5 pt-0.5">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full text-mamalog-muted hover:bg-mamalog-sub/40 hover:text-mamalog-text"
        onClick={props.onPrev}
        aria-label="先月"
      >
        ‹
      </button>
      <p className="text-[16px] font-bold tracking-tight text-mamalog-text">{title}</p>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full text-mamalog-muted hover:bg-mamalog-sub/40 hover:text-mamalog-text"
        onClick={props.onNext}
        aria-label="来月"
      >
        ›
      </button>
    </div>
  );
}
