"use client";

import { isoFromDate, monthMatrix, weekdaysJa } from "@/lib/dates";
import { toISODate } from "@/lib/mamalog";

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
  const todayISO = toISODate(new Date());

  return (
    <div className="w-full">
      <div className="mx-auto grid max-w-[340px] grid-cols-7 pb-2 pt-1 text-center">
        {weekdays.map((wd, idx) => (
          <div
            key={wd}
            className={`text-[11px] font-bold tracking-tight ${
              idx === 0 ? "text-mamalog-main/80" : idx === 6 ? "text-mamalog-blue/90" : "text-mamalog-muted"
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-[340px] grid-cols-7 gap-x-0 gap-y-2.5 py-1">
        {cells.map((d, idx) => {
          if (!d) {
            return <div key={`empty-${idx}`} className="h-11 min-h-[2.75rem]" />;
          }

          const iso = isoFromDate(d);
          const selected = iso === selectedDateISO;
          const colors = (dotsByDate[iso] ?? []).slice(0, 3);
          const isToday = iso === todayISO;
          const dow = d.getDay();

          return (
            <button
              type="button"
              key={iso}
              onClick={() => onPickDate(iso)}
              className="group mx-auto flex w-full max-w-[3rem] flex-col items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-mamalog-main/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <span
                className={`flex h-[2.3125rem] w-[2.3125rem] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold tracking-tight transition ${
                  selected
                    ? "bg-mamalog-main text-white shadow-[0_3px_10px_-3px_rgba(255,127,145,0.34)]"
                    : isToday
                      ? "bg-[#FFD6DD]/92 text-[#CC4F65] shadow-[inset_0_0_0_1px_rgba(255,127,145,0.22)]"
                      : dow === 0
                        ? "text-mamalog-main/80 group-hover:bg-mamalog-sub/50"
                        : dow === 6
                          ? "text-mamalog-blue/90 group-hover:bg-mamalog-sub/50"
                          : "text-mamalog-text group-hover:bg-mamalog-sub/50"
                }`}
              >
                {d.getDate()}
              </span>
              <span
                aria-hidden
                className="flex h-[5px] min-h-[5px] items-center justify-center gap-0.5"
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
    <div className="mx-auto flex w-full max-w-[340px] items-center pb-3 pt-0.5">
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mamalog-muted transition hover:bg-mamalog-sub/40 hover:text-mamalog-text"
        onClick={props.onPrev}
        aria-label="先月"
      >
        ‹
      </button>
      <p className="min-w-0 flex-1 text-center text-[16px] font-bold tracking-tight text-mamalog-text">{title}</p>
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mamalog-muted transition hover:bg-mamalog-sub/40 hover:text-mamalog-text"
        onClick={props.onNext}
        aria-label="来月"
      >
        ›
      </button>
    </div>
  );
}
