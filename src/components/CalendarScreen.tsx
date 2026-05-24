"use client";

import { useMemo } from "react";
import { CalendarMonth, CalendarMonthHeader } from "./CalendarMonth";
import { DayTimeline } from "./DayTimeline";
import { MemberTabs } from "./MemberTabs";
import { ScheduleRow } from "./ScheduleList";
import type {
  CalendarGranularity,
  Member,
  ScheduleCategory,
  ScheduleItem,
} from "@/lib/mamalog";
import {
  addDaysToISO,
  isoFromDate,
  parseISOLocal,
  weekRangeSundayContaining,
} from "@/lib/dates";

type CalendarScreenProps = {
  members: Member[];
  selectedMemberId: string | null;
  onMemberChange: (id: string | null) => void;

  calendarView: CalendarGranularity;
  onCalendarViewChange: (v: CalendarGranularity) => void;

  cursorYear: number;
  cursorMonthIndex: number;
  onMonthShift: (delta: number) => void;

  selectedDateISO: string;
  onSelectDateISO: (iso: string) => void;

  schedules: ScheduleItem[];
  categories: ScheduleCategory[];
  /** 予定をクリックしたときの編集起動ハンドラ */
  onScheduleClick?: (s: ScheduleItem) => void;
  /** メンバー一覧右の「追加」からメンバー登録へ */
  onAddMember?: () => void;
};

function inMonth(s: ScheduleItem, y: number, mIdx: number): boolean {
  const d = parseISOLocal(s.dateISO);
  return d.getFullYear() === y && d.getMonth() === mIdx;
}

function inWeek(s: ScheduleItem, week: Date[]): boolean {
  const set = new Set(week.map(isoFromDate));
  return set.has(s.dateISO);
}

function formatJpDate(iso: string): string {
  const d = parseISOLocal(iso);
  const wd = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日（${wd}）`;
}

function groupByDate(items: ScheduleItem[]): [string, ScheduleItem[]][] {
  const map = new Map<string, ScheduleItem[]>();
  items.forEach((s) => {
    const arr = map.get(s.dateISO) ?? [];
    arr.push(s);
    map.set(s.dateISO, arr);
  });
  [...map.values()].forEach((arr) => arr.sort((a, b) => a.time.localeCompare(b.time)));
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function ScheduleGroup({
  iso,
  rows,
  categories,
  members,
  onScheduleClick,
}: {
  iso: string;
  rows: ScheduleItem[];
  categories: ScheduleCategory[];
  members: Member[];
  onScheduleClick?: (s: ScheduleItem) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="px-0.5 text-[12.5px] font-bold text-mamalog-text">{formatJpDate(iso)}</h3>
      <ul className="divide-y divide-black/[0.04] overflow-hidden rounded-2xl border border-black/[0.04] bg-white/62 backdrop-blur-[2px]">
        {rows.map((s) => (
          <ScheduleRow key={s.id} s={s} categories={categories} members={members} onClick={onScheduleClick} />
        ))}
      </ul>
    </div>
  );
}

function EmptyCard({
  message,
  emphasis = "default",
}: {
  message: string;
  emphasis?: "default" | "soft";
}) {
  if (emphasis === "soft") {
    return (
      <div className="rounded-2xl border border-transparent bg-gradient-to-br from-mamalog-sub/30 via-white/[0.45] to-mamalog-sub/[0.08] px-4 py-[1.625rem] text-center backdrop-blur-[1px]">
        <p className="mx-auto max-w-[18rem] text-[12px] leading-relaxed text-mamalog-muted/95">{message}</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-black/[0.04] bg-white/62 px-4 py-[1.875rem] text-center backdrop-blur-[2px]">
      <p className="text-[12px] text-mamalog-muted">{message}</p>
    </div>
  );
}

function weekRangeLabel(start: Date, end: Date): string {
  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${start.getMonth() + 1}月${start.getDate()}日〜${end.getDate()}日`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getMonth() + 1}/${start.getDate()}〜${end.getMonth() + 1}/${end.getDate()}日（${start.getFullYear()}年）`;
  }
  return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}〜${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}`;
}

function WeekStripNav({
  weekDates,
  selectedDateISO,
  onSelectDateISO,
  onShiftWeek,
}: {
  weekDates: Date[];
  selectedDateISO: string;
  onSelectDateISO: (iso: string) => void;
  onShiftWeek: (delta: number) => void;
}) {
  const start = weekDates[0];
  const end = weekDates[6];
  const dow = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-6 px-1 pb-0.5 pt-0.5">
        <button
          type="button"
          aria-label="前の週"
          onClick={() => onShiftWeek(-7)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-mamalog-muted hover:bg-mamalog-sub/40 hover:text-mamalog-text"
        >
          ‹
        </button>
        <p className="text-[15px] font-bold tracking-tight text-mamalog-text">{weekRangeLabel(start, end)}</p>
        <button
          type="button"
          aria-label="次の週"
          onClick={() => onShiftWeek(7)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-mamalog-muted hover:bg-mamalog-sub/40 hover:text-mamalog-text"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 px-0.5">
        {weekDates.map((d) => {
          const iso = isoFromDate(d);
          const sel = iso === selectedDateISO;
          const di = d.getDay();
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDateISO(iso)}
              className={`flex flex-col items-center gap-0.5 rounded-2xl py-2 transition ${
                sel ? "bg-mamalog-main/12 ring-1 ring-mamalog-main/35" : "hover:bg-mamalog-sub/35"
              }`}
            >
              <span
                className={`text-[10px] font-bold ${
                  di === 0 ? "text-mamalog-main/80" : di === 6 ? "text-mamalog-blue/90" : "text-mamalog-muted"
                }`}
              >
                {dow[di]}
              </span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold ${
                  sel ? "bg-mamalog-main text-white shadow-[0_4px_10px_-2px_rgba(255,127,145,0.45)]" : "text-mamalog-text"
                }`}
              >
                {d.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayStripNav({
  selectedDateISO,
  onShiftDay,
}: {
  selectedDateISO: string;
  onShiftDay: (delta: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-6 px-1 pb-2 pt-0.5">
      <button
        type="button"
        aria-label="前日"
        onClick={() => onShiftDay(-1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-mamalog-muted hover:bg-mamalog-sub/40 hover:text-mamalog-text"
      >
        ‹
      </button>
      <p className="text-[16px] font-bold tracking-tight text-mamalog-text">{formatJpDate(selectedDateISO)}</p>
      <button
        type="button"
        aria-label="翌日"
        onClick={() => onShiftDay(1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-mamalog-muted hover:bg-mamalog-sub/40 hover:text-mamalog-text"
      >
        ›
      </button>
    </div>
  );
}

export function CalendarScreen({
  members,
  selectedMemberId,
  onMemberChange,
  calendarView,
  onCalendarViewChange,
  cursorYear,
  cursorMonthIndex,
  onMonthShift,
  selectedDateISO,
  onSelectDateISO,
  schedules,
  categories,
  onScheduleClick,
  onAddMember,
}: CalendarScreenProps) {
  const selectedMember = useMemo(
    () => (selectedMemberId ? members.find((m) => m.id === selectedMemberId) ?? null : null),
    [members, selectedMemberId],
  );

  /** 削除されたメンバーの予定はカレンダー上から取り除く */
  const visibleSchedules = useMemo(
    () => schedules.filter((s) => members.some((m) => m.id === s.memberId)),
    [schedules, members],
  );

  /**
   * 「すべて」のときは人物フィルタを無視して全員分。
   * 「日 / 週 / 月」のときは選択中メンバーの予定だけを表示し、
   * 未選択ならカレンダー側も予定リスト側も空にして
   * 「メンバーを選んで」プロンプトを出す。
   */
  const personFiltered = useMemo(() => {
    if (calendarView === "all") return visibleSchedules;
    if (!selectedMemberId) return [];
    return visibleSchedules.filter((s) => s.memberId === selectedMemberId);
  }, [visibleSchedules, selectedMemberId, calendarView]);

  /** カレンダーグリッドに撒くドット色（日付ごとに最大3色まで） */
  const dotsByDate = useMemo(() => {
    const map: Record<string, string[]> = {};
    personFiltered.forEach((s) => {
      const m = members.find((mm) => mm.id === s.memberId);
      if (!m) return;
      const arr = map[s.dateISO] ?? [];
      if (!arr.includes(m.colorHex) && arr.length < 3) arr.push(m.colorHex);
      map[s.dateISO] = arr;
    });
    return map;
  }, [personFiltered, members]);

  const weekDates = useMemo(() => weekRangeSundayContaining(selectedDateISO), [selectedDateISO]);

  const dayFiltered = useMemo(
    () =>
      personFiltered
        .filter((s) => s.dateISO === selectedDateISO)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [personFiltered, selectedDateISO],
  );

  const weekFiltered = useMemo(
    () => personFiltered.filter((s) => inWeek(s, weekDates)),
    [personFiltered, weekDates],
  );

  const monthFiltered = useMemo(
    () => personFiltered.filter((s) => inMonth(s, cursorYear, cursorMonthIndex)),
    [personFiltered, cursorYear, cursorMonthIndex],
  );

  const allGroups = useMemo(() => groupByDate(personFiltered), [personFiltered]);
  const monthGroups = useMemo(() => groupByDate(monthFiltered), [monthFiltered]);
  const weekGroups = useMemo(() => groupByDate(weekFiltered), [weekFiltered]);

  const pills: { id: CalendarGranularity; label: string }[] = [
    { id: "all", label: "すべて" },
    { id: "month", label: "月" },
    { id: "week", label: "週" },
    { id: "day", label: "日" },
  ];

  const personLabel = selectedMember
    ? `${selectedMember.name}さんの予定`
    : calendarView === "all"
      ? "全員の予定"
      : "メンバー未選択";

  const noMemberInPersonView = !selectedMember && calendarView !== "all";
  const selectMemberMsg =
    members.length === 0
      ? "左の＋からメンバーを追加してください"
      : "メンバータブから対象を選んでください";
  const sectionTitle =
    calendarView === "all"
      ? "すべての予定"
      : calendarView === "day"
        ? formatJpDate(selectedDateISO)
        : calendarView === "week"
          ? "この週の予定"
          : `${cursorYear}年${cursorMonthIndex + 1}月の予定`;

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* スクロール時も画面上に残す：表示切替 + メンバータブ */}
      <div className="sticky top-0 z-20 -mx-4 mb-1 border-b border-black/[0.04] px-4 pb-3 pt-3 backdrop-blur-lg bg-[#FFF9FA]/90 supports-[backdrop-filter]:bg-[#FFF9FA]/75">
        <div className="flex flex-col gap-4">
          <div
            className="flex w-full rounded-full bg-mamalog-sub/40 p-1"
            role="tablist"
            aria-label="表示切り替え"
          >
            {pills.map((p) => {
              const on = calendarView === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => onCalendarViewChange(p.id)}
                  className={`flex-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                    on
                      ? "bg-mamalog-main text-white shadow-none"
                      : "text-mamalog-muted hover:text-mamalog-text/80"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {members.length > 0 ? (
            <div className="flex items-start gap-2">
              {onAddMember ? (
                <button
                  type="button"
                  aria-label="メンバーを追加"
                  onClick={onAddMember}
                  className="mt-2 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-mamalog-sub/45 text-mamalog-main transition hover:bg-mamalog-sub/70 active:scale-[0.94]"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              ) : null}
              <div className="relative min-w-0 flex-1">
                <MemberTabs members={members} selectedId={selectedMemberId} onSelect={onMemberChange} />
              </div>
            </div>
          ) : onAddMember ? (
            <div className="flex justify-start pt-1">
              <button
                type="button"
                aria-label="メンバーを追加"
                onClick={onAddMember}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-mamalog-sub/45 text-mamalog-main transition hover:bg-mamalog-sub/70 active:scale-[0.94]"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {(calendarView === "month" || calendarView === "all") && (
        <>
          <CalendarMonthHeader
            year={cursorYear}
            monthIndex={cursorMonthIndex}
            onPrev={() => onMonthShift(-1)}
            onNext={() => onMonthShift(1)}
          />

          <CalendarMonth
            year={cursorYear}
            monthIndex={cursorMonthIndex}
            selectedDateISO={selectedDateISO}
            dotsByDate={dotsByDate}
            onPickDate={onSelectDateISO}
          />
        </>
      )}

      {calendarView === "week" && (
        <WeekStripNav
          weekDates={weekDates}
          selectedDateISO={selectedDateISO}
          onSelectDateISO={onSelectDateISO}
          onShiftWeek={(delta) => onSelectDateISO(addDaysToISO(selectedDateISO, delta))}
        />
      )}

      {calendarView === "day" && (
        <DayStripNav
          selectedDateISO={selectedDateISO}
          onShiftDay={(delta) => onSelectDateISO(addDaysToISO(selectedDateISO, delta))}
        />
      )}

      <section className="space-y-3">
        {calendarView !== "day" ? (
          <div className="flex items-baseline justify-between px-0.5">
            <h2 className="text-[14px] font-bold text-mamalog-text">{sectionTitle}</h2>
            <span className="text-[10.5px] text-mamalog-muted">{personLabel}</span>
          </div>
        ) : (
          <div className="flex justify-end px-0.5">
            <span className="text-[10.5px] text-mamalog-muted">{personLabel}</span>
          </div>
        )}

        {calendarView === "day" ? (
          <DayTimeline
            schedules={dayFiltered}
            categories={categories}
            members={members}
            onScheduleClick={onScheduleClick}
            emptyMessage={
              noMemberInPersonView
                ? selectMemberMsg
                : selectedMember
                  ? `${selectedMember.name}さんの予定はありません`
                  : "この日の予定はありません"
            }
          />
        ) : null}

        {calendarView === "week" ? (
          weekGroups.length === 0 ? (
            <EmptyCard
              message={noMemberInPersonView ? selectMemberMsg : "今週の予定はありません"}
              emphasis={noMemberInPersonView ? "soft" : "default"}
            />
          ) : (
            <div className="space-y-3">
              {weekGroups.map(([iso, rows]) => (
                <ScheduleGroup
                  key={iso}
                  iso={iso}
                  rows={rows}
                  categories={categories}
                  members={members}
                  onScheduleClick={onScheduleClick}
                />
              ))}
            </div>
          )
        ) : null}

        {calendarView === "month" ? (
          monthGroups.length === 0 ? (
            <EmptyCard
              message={
                noMemberInPersonView
                  ? selectMemberMsg
                  : `${cursorMonthIndex + 1}月の予定はありません`
              }
              emphasis={noMemberInPersonView ? "soft" : "default"}
            />
          ) : (
            <div className="space-y-3">
              {monthGroups.map(([iso, rows]) => (
                <ScheduleGroup
                  key={iso}
                  iso={iso}
                  rows={rows}
                  categories={categories}
                  members={members}
                  onScheduleClick={onScheduleClick}
                />
              ))}
            </div>
          )
        ) : null}

        {calendarView === "all" ? (
          allGroups.length === 0 ? (
            <EmptyCard message="予定はまだありません" />
          ) : (
            <div className="space-y-3">
              {allGroups.map(([iso, rows]) => (
                <ScheduleGroup
                  key={iso}
                  iso={iso}
                  rows={rows}
                  categories={categories}
                  members={members}
                  onScheduleClick={onScheduleClick}
                />
              ))}
            </div>
          )
        ) : null}
      </section>
    </div>
  );
}
