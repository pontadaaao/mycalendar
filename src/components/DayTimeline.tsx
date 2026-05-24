"use client";

import type { Member, ScheduleCategory, ScheduleItem } from "@/lib/mamalog";
import { findCategory } from "@/lib/mamalog";

function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map((x) => Number(x));
  return (h ?? 0) * 60 + (m ?? 0);
}

const PX_PER_HOUR = 52;
const DEFAULT_DURATION_MIN = 60;

type DayTimelineProps = {
  schedules: ScheduleItem[];
  categories: ScheduleCategory[];
  members: Member[];
  onScheduleClick?: (s: ScheduleItem) => void;
  emptyMessage?: string;
};

export function DayTimeline({
  schedules,
  categories,
  members,
  onScheduleClick,
  emptyMessage = "この日の予定はありません",
}: DayTimelineProps) {
  const allDay = schedules.filter((s) => s.allDay);
  const timed = schedules.filter((s) => !s.allDay).sort((a, b) => a.time.localeCompare(b.time));

  if (timed.length === 0 && allDay.length === 0) {
    return (
      <div className="rounded-2xl border border-black/[0.04] bg-white/62 px-4 py-10 text-center backdrop-blur-[2px]">
        <p className="text-[12px] leading-relaxed text-mamalog-muted">{emptyMessage}</p>
      </div>
    );
  }

  let minMin = 8 * 60;
  let maxMin = 20 * 60;
  for (const s of timed) {
    const start = parseMinutes(s.time);
    let end = start + DEFAULT_DURATION_MIN;
    if (s.endTime) end = parseMinutes(s.endTime);
    minMin = Math.min(minMin, start);
    maxMin = Math.max(maxMin, end);
  }
  const startHour = Math.max(0, Math.floor(minMin / 60) - 1);
  const endHour = Math.min(24, Math.ceil(maxMin / 60) + 1);
  const gridStartMin = startHour * 60;
  const numSlots = endHour - startHour;
  const totalPx = numSlots * PX_PER_HOUR;

  function blockStyle(s: ScheduleItem): { top: number; height: number } {
    const start = parseMinutes(s.time);
    const end = s.endTime ? parseMinutes(s.endTime) : start + DEFAULT_DURATION_MIN;
    const top = ((start - gridStartMin) / 60) * PX_PER_HOUR;
    const height = Math.max(((end - start) / 60) * PX_PER_HOUR, 30);
    return { top, height };
  }

  const hourIndices = Array.from({ length: numSlots }, (_, i) => startHour + i);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.04] bg-white/62 backdrop-blur-[2px]">
      {allDay.length > 0 ? (
        <div className="space-y-1.5 border-b border-black/[0.05] px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-mamalog-muted">終日</p>
          <div className="flex flex-wrap gap-1.5">
            {allDay.map((s) => {
              const category = findCategory(categories, s.categoryId);
              const m = members.find((mem) => mem.id === s.memberId);
              const Btn = onScheduleClick ? "button" : "div";
              return (
                <Btn
                  key={s.id}
                  type={onScheduleClick ? "button" : undefined}
                  onClick={onScheduleClick ? () => onScheduleClick(s) : undefined}
                  className={`flex max-w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left ring-1 ring-black/[0.06] transition ${
                    onScheduleClick ? "hover:bg-mamalog-sub/25 active:bg-mamalog-sub/35" : ""
                  }`}
                  style={{ backgroundColor: category.bg }}
                >
                  <span
                    className="h-8 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-mamalog-text">
                    {s.title}
                  </span>
                  {m ? (
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px]"
                      style={{
                        backgroundColor: m.avatarImage ? "transparent" : m.avatarBg,
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
                      }}
                    >
                      {m.avatarImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.avatarImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span aria-hidden>{m.avatar}</span>
                      )}
                    </span>
                  ) : (
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mamalog-sub/45 text-[10px] font-bold text-mamalog-muted"
                      aria-hidden
                    >
                      ?
                    </span>
                  )}
                </Btn>
              );
            })}
          </div>
        </div>
      ) : null}

      {timed.length > 0 ? (
        <div className="flex max-h-[min(520px,62vh)] overflow-y-auto overflow-x-hidden">
          <div className="w-11 shrink-0 select-none py-1">
            {hourIndices.map((h) => (
              <div
                key={h}
                className="box-border flex items-start justify-end pr-2 pt-0 text-[10px] font-semibold tabular-nums text-mamalog-muted"
                style={{ height: PX_PER_HOUR }}
              >
                {h}:00
              </div>
            ))}
          </div>
          <div
            className="relative flex-1 border-l border-black/[0.06] py-1 pr-2"
            style={{ minHeight: totalPx }}
          >
            {Array.from({ length: numSlots + 1 }, (_, i) => (
              <div
                key={i}
                className="pointer-events-none absolute left-0 right-0 border-t border-black/[0.05]"
                style={{ top: i * PX_PER_HOUR }}
              />
            ))}
            {timed.map((s) => {
              const { top, height } = blockStyle(s);
              const category = findCategory(categories, s.categoryId);
              const m = members.find((mem) => mem.id === s.memberId);
              const Btn = onScheduleClick ? "button" : "div";
              return (
                <Btn
                  key={s.id}
                  type={onScheduleClick ? "button" : undefined}
                  onClick={onScheduleClick ? () => onScheduleClick(s) : undefined}
                  className={`absolute left-1 right-0 flex overflow-hidden rounded-xl text-left shadow-[0_1px_4px_rgba(58,42,42,0.06)] ring-1 ring-black/[0.06] transition ${
                    onScheduleClick ? "hover:brightness-[0.98] active:brightness-[0.95]" : ""
                  }`}
                  style={{
                    top,
                    height,
                    backgroundColor: category.bg,
                  }}
                >
                  <span
                    className="w-1 shrink-0 self-stretch"
                    style={{ backgroundColor: category.color }}
                    aria-hidden
                  />
                  <div className="flex min-w-0 flex-1 items-start gap-2 px-2 py-1">
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-[12px] font-bold text-mamalog-text">{s.title}</p>
                      <p className="mt-0.5 text-[10px] font-semibold tabular-nums text-mamalog-muted">
                        {s.time}
                        {s.endTime ? `〜${s.endTime}` : ""}
                      </p>
                    </div>
                    {m ? (
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px]"
                        style={{
                          backgroundColor: m.avatarImage ? "transparent" : m.avatarBg,
                          boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
                        }}
                      >
                        {m.avatarImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.avatarImage} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span aria-hidden>{m.avatar}</span>
                        )}
                      </span>
                    ) : (
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mamalog-sub/45 text-[11px] font-bold text-mamalog-muted"
                        aria-hidden
                      >
                        ?
                      </span>
                    )}
                  </div>
                </Btn>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
