"use client";

import type { Member, ScheduleCategory, ScheduleItem } from "@/lib/mamalog";
import { findCategory } from "@/lib/mamalog";
import { parseISOLocal } from "@/lib/dates";

function shortMd(iso: string): string {
  const d = parseISOLocal(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/**
 * 表示用の時刻ブロック。
 * - 終日：「終日」バッジ
 * - 同日 + 終了時刻あり：上下2行で 開始 / 〜終了
 * - 別日：上下2行で M/D HH:MM / 〜M/D HH:MM
 */
function TimeBlock({ s }: { s: ScheduleItem }) {
  if (s.allDay) {
    return (
      <span className="rounded-full bg-mamalog-sub/40 px-2 py-0.5 text-[10px] font-bold text-mamalog-text">
        終日
      </span>
    );
  }

  const sameDay = !s.endDateISO || s.endDateISO === s.dateISO;

  if (sameDay) {
    return (
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[13px] font-bold tabular-nums text-mamalog-text">{s.time}</span>
        {s.endTime ? (
          <span className="text-[10px] tabular-nums text-mamalog-muted">〜{s.endTime}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start leading-tight">
      <span className="text-[10.5px] font-bold tabular-nums text-mamalog-text">
        {shortMd(s.dateISO)} {s.time}
      </span>
      <span className="text-[10px] tabular-nums text-mamalog-muted">
        〜{shortMd(s.endDateISO!)}
        {s.endTime ? ` ${s.endTime}` : ""}
      </span>
    </div>
  );
}

type ScheduleRowProps = {
  s: ScheduleItem;
  categories: ScheduleCategory[];
  /** アプリに登録されているメンバー（予定の memberId と突き合わせてアバター表示） */
  members: Member[];
  /** 行クリック時のコールバック（編集ペインを開くなど） */
  onClick?: (s: ScheduleItem) => void;
};

export function ScheduleRow({ s, categories, members, onClick }: ScheduleRowProps) {
  const m = members.find((mem) => mem.id === s.memberId);
  const category = findCategory(categories, s.categoryId);

  const Wrapper = onClick ? "button" : "div";
  const wrapperProps = onClick
    ? {
        type: "button" as const,
        onClick: () => onClick(s),
        className:
          "flex w-full items-stretch text-left transition hover:bg-mamalog-sub/20 active:bg-mamalog-sub/30",
      }
    : { className: "flex items-stretch" };

  return (
    <li>
      <Wrapper {...wrapperProps}>
      <span
        className="w-1 shrink-0 self-stretch"
        style={{ backgroundColor: category.color }}
        aria-hidden
      />
      <div className="flex flex-1 items-start gap-x-2 gap-y-1 py-3.5 pl-2 pr-3">
        <div className="shrink-0 pt-0.5 text-left">
          <TimeBlock s={s} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-mamalog-text">{s.title}</p>
          {s.location ? (
            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-mamalog-muted">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="shrink-0"
              >
                <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span className="truncate">{s.location}</span>
            </p>
          ) : null}
          {s.memo ? (
            <p className="mt-0.5 line-clamp-2 whitespace-pre-wrap text-[10.5px] leading-relaxed text-mamalog-muted/90">
              {s.memo}
            </p>
          ) : null}
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <span
              className="inline-flex items-center gap-1 rounded-full py-[1.5px] pl-1 pr-2 text-[10.5px] font-bold"
              style={{ backgroundColor: category.bg, color: category.color }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </span>
          </div>
        </div>
        <div className="ml-1 mt-0.5 flex shrink-0 flex-col items-center gap-1">
          {m ? (
            <>
              <span
                className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-[14px]"
                style={{
                  backgroundColor: m.avatarImage ? "transparent" : m.avatarBg,
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
                }}
              >
                {m.avatarImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatarImage} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <span aria-hidden>{m.avatar}</span>
                )}
              </span>
              <span className="max-w-[56px] truncate text-center text-[10px] font-bold leading-tight text-mamalog-muted">
                {m.name}
              </span>
            </>
          ) : (
            <>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-mamalog-sub/45 text-[11px] font-bold text-mamalog-muted"
                style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.04)" }}
                aria-hidden
              >
                ?
              </span>
              <span className="max-w-[56px] truncate text-center text-[10px] font-bold leading-tight text-mamalog-muted">
                —
              </span>
            </>
          )}
        </div>
      </div>
      </Wrapper>
    </li>
  );
}

type ScheduleListProps = {
  schedules: ScheduleItem[];
  categories: ScheduleCategory[];
  members: Member[];
  /** 行クリックで編集ペインを開くハンドラ */
  onScheduleClick?: (s: ScheduleItem) => void;
  /** 空状態の文言 */
  emptyMessage?: string;
};

/**
 * 予定行のリストだけを描画するシンプルなプレゼンテーションコンポーネント。
 * 日付見出しは呼び出し側のセクションヘッダで一本化しているため、ここには出さない。
 */
export function ScheduleList({
  schedules,
  categories,
  members,
  onScheduleClick,
  emptyMessage = "予定はありません",
}: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-4 py-8 text-center ring-1 ring-black/[0.04]">
        <p className="text-[12px] text-mamalog-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(58,42,42,0.04)] ring-1 ring-black/[0.04]">
      {schedules.map((s, idx) => (
        <div key={s.id} className={idx > 0 ? "border-t border-black/[0.05]" : ""}>
          <ScheduleRow s={s} categories={categories} members={members} onClick={onScheduleClick} />
        </div>
      ))}
    </ul>
  );
}
