"use client";

import { useEffect, useMemo, useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { AddCategorySheet, type AddCategoryPayload } from "./AddCategorySheet";
import type { Member, ScheduleCategory, ScheduleItem } from "@/lib/mamalog";

export type AddSchedulePayload = {
  title: string;
  location: string;
  memo: string;
  /** 開始日 YYYY-MM-DD */
  dateISO: string;
  /** 開始時刻 HH:MM（allDay のときは "00:00"） */
  time: string;
  /** 終了日 YYYY-MM-DD */
  endDateISO: string;
  /** 終了時刻 HH:MM（allDay のときは undefined） */
  endTime?: string;
  allDay: boolean;
  categoryId: string;
  memberId: string;
};

type AddSchedulePaneProps = {
  members: Member[];
  /** ユーザーが作成したものを含む現時点でのカテゴリリスト */
  categories: ScheduleCategory[];
  /** カテゴリ追加（保存後の id を返す。AddSchedulePane はそれを選択中にする） */
  onAddCategory: (payload: AddCategoryPayload) => string;
  /** カテゴリ名の変更（フォーム内セクションの編集モード用） */
  onRenameCategory: (id: string, name: string) => void;
  /** カテゴリ削除（先頭へ予定の categoryId を付け替える処理は親側） */
  onDeleteCategory: (id: string) => void;
  /** デフォルト色で「新規カテゴリ」を追加し id を返す（編集モード時のクイック追加） */
  onQuickAddCategory: () => string;
  /** ペインを開いた時の初期日付（カレンダーで選択中の日） */
  initialDateISO: string;
  /** 初期メンバー（メンバータブで選択中のメンバーがあれば） */
  initialMemberId?: string | null;
  /** 編集モードのときに渡す既存スケジュール */
  editingSchedule?: ScheduleItem;
  onClose: () => void;
  onSave: (payload: AddSchedulePayload) => void;
  /** 編集モードのときに「削除」ボタンを押したら呼ばれる（確認は本コンポーネント側で実施済み） */
  onDelete?: () => void;
};

/** "YYYY-MM-DD" + "HH:MM" → "YYYY-MM-DDTHH:MM" の文字列を作る */
function toLocalDatetime(dateISO: string, time: string): string {
  return `${dateISO}T${time}`;
}

/** "10:00" + "+1h" 風に時刻を進める */
function addHour(time: string, hours: number): string {
  const [h, m] = time.split(":").map((v) => parseInt(v, 10));
  const total = (h * 60 + m + hours * 60 + 24 * 60) % (24 * 60);
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

function CategorySectionPencilIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16.5 3.5l4 4L8 20l-5 1 1-5z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

function CategorySectionCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 12l4 4 8-8" />
    </svg>
  );
}

export function AddSchedulePane({
  members,
  categories,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onQuickAddCategory,
  initialDateISO,
  initialMemberId,
  editingSchedule,
  onClose,
  onSave,
  onDelete,
}: AddSchedulePaneProps) {
  const isEdit = !!editingSchedule;

  const [title, setTitle] = useState(editingSchedule?.title ?? "");
  const [location, setLocation] = useState(editingSchedule?.location ?? "");
  const [memo, setMemo] = useState(editingSchedule?.memo ?? "");
  const [allDay, setAllDay] = useState(editingSchedule?.allDay ?? false);

  const [startDate, setStartDate] = useState(editingSchedule?.dateISO ?? initialDateISO);
  const [startTime, setStartTime] = useState(
    editingSchedule && !editingSchedule.allDay ? editingSchedule.time : "10:00",
  );
  const [endDate, setEndDate] = useState(
    editingSchedule?.endDateISO ?? editingSchedule?.dateISO ?? initialDateISO,
  );
  const [endTime, setEndTime] = useState(
    editingSchedule && !editingSchedule.allDay
      ? editingSchedule.endTime ?? "11:00"
      : "11:00",
  );

  const initialCategoryId =
    editingSchedule?.categoryId &&
    categories.some((c) => c.id === editingSchedule.categoryId)
      ? editingSchedule.categoryId
      : categories[0]?.id ?? "";
  const [categoryId, setCategoryId] = useState<string>(initialCategoryId);

  const initialMemberIdFromSchedule =
    editingSchedule?.memberId && members.some((m) => m.id === editingSchedule.memberId)
      ? editingSchedule.memberId
      : null;
  const [memberId, setMemberId] = useState<string>(
    initialMemberIdFromSchedule ?? initialMemberId ?? members[0]?.id ?? "",
  );

  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [categorySectionEditing, setCategorySectionEditing] = useState(false);

  useEffect(() => {
    if (categories.length === 0) return;
    if (!categories.some((c) => c.id === categoryId)) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const startCombined = useMemo(
    () => (allDay ? startDate : toLocalDatetime(startDate, startTime)),
    [allDay, startDate, startTime],
  );
  const endCombined = useMemo(
    () => (allDay ? endDate : toLocalDatetime(endDate, endTime)),
    [allDay, endDate, endTime],
  );

  const isInvalidRange = startCombined > endCombined;
  const canSave = title.trim().length > 0 && !!memberId && !isInvalidRange;

  function handleStartDateChange(v: string) {
    setStartDate(v);
    if (v > endDate) setEndDate(v);
  }

  function handleStartTimeChange(v: string) {
    setStartTime(v);
    if (startDate === endDate && v >= endTime) {
      setEndTime(addHour(v, 1));
    }
  }

  function handleAllDayToggle() {
    const next = !allDay;
    setAllDay(next);
    if (!next && startDate === endDate && startTime >= endTime) {
      setEndTime(addHour(startTime, 1));
    }
  }

  function handleSave() {
    if (!canSave) return;
    onSave({
      title: title.trim(),
      location: location.trim(),
      memo: memo.trim(),
      dateISO: startDate,
      time: allDay ? "00:00" : startTime,
      endDateISO: endDate,
      endTime: allDay ? undefined : endTime,
      allDay,
      categoryId,
      memberId,
    });
  }

  function handleSaveCategory(payload: AddCategoryPayload) {
    const newId = onAddCategory(payload);
    setCategoryId(newId);
    setCategorySheetOpen(false);
    setCategorySectionEditing(true);
  }

  function toggleCategorySectionEditing() {
    if (categorySectionEditing) {
      if (typeof document !== "undefined") {
        (document.activeElement as HTMLElement | null)?.blur?.();
      }
      queueMicrotask(() => setCategorySectionEditing(false));
    } else {
      setCategorySectionEditing(true);
    }
  }

  function handleDelete() {
    if (!isEdit) return;
    const label = editingSchedule?.title || "この予定";
    if (window.confirm(`「${label}」を削除しますか？\nこの操作は元に戻せません。`)) {
      onDelete?.();
    }
  }

  const headerTitle = isEdit ? "予定を編集" : "新しい予定";
  const ctaLabel = isEdit ? "変更を保存" : "この予定を追加";

  /** カレンダーのメンバータブで選択していたメンバー（新規のみヘッダ下で明示） */
  const calendarSelectedMember = useMemo(() => {
    if (isEdit || initialMemberId == null || initialMemberId === "") return null;
    return members.find((m) => m.id === initialMemberId) ?? null;
  }, [isEdit, initialMemberId, members]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="新しい予定"
      className="absolute inset-0 z-50 flex min-h-0 flex-col bg-white"
    >
      {/* ヘッダ */}
      <header className="relative flex items-center border-b border-black/[0.05] px-4 pt-[21px] pb-[17px]">
        <button
          type="button"
          onClick={onClose}
          className="text-[13px] font-semibold text-mamalog-muted hover:text-mamalog-text"
        >
          キャンセル
        </button>
        <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[15px] font-bold text-mamalog-text">
          {headerTitle}
        </h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="ml-auto text-[13px] font-bold text-mamalog-main disabled:opacity-40"
        >
          保存
        </button>
      </header>

      {calendarSelectedMember ? (
        <div className="flex shrink-0 items-center gap-3 border-b border-black/[0.06] bg-mamalog-sub/25 px-5 py-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
            style={{
              backgroundColor: calendarSelectedMember.avatarImage
                ? "transparent"
                : calendarSelectedMember.avatarBg,
            }}
            aria-hidden
          >
            {calendarSelectedMember.avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={calendarSelectedMember.avatarImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{calendarSelectedMember.avatar}</span>
            )}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.04em] text-mamalog-muted">
              カレンダーで選択中のメンバー
            </p>
            <p className="truncate text-[14px] font-bold text-mamalog-text">
              {calendarSelectedMember.name}さんの予定として追加します
            </p>
          </div>
        </div>
      ) : null}

      {/* 本体 */}
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-6">
        {/* 予定名 */}
        <section>
          <label htmlFor="scheduleTitle" className="text-[11px] font-bold text-mamalog-muted">
            予定名
          </label>
          <input
            id="scheduleTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：ゆうとの予防接種 / お遊戯会"
            maxLength={40}
            className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-mamalog-sub/30 px-3 py-2.5 text-[14px] font-semibold text-mamalog-text caret-mamalog-main outline-none transition focus:border-mamalog-main/50 focus:bg-white"
          />
        </section>

        {/* 場所 */}
        <section className="mt-4">
          <label htmlFor="scheduleLocation" className="text-[11px] font-bold text-mamalog-muted">
            場所
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mamalog-muted">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </span>
            <input
              id="scheduleLocation"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例：小児科 / 表参道"
              maxLength={40}
              className="w-full rounded-xl border border-black/[0.08] bg-mamalog-sub/30 py-2.5 pl-9 pr-3 text-[13.5px] font-medium text-mamalog-text caret-mamalog-main outline-none transition focus:border-mamalog-main/50 focus:bg-white"
            />
          </div>
        </section>

        {/* 日付セクション */}
        <section className="mt-5 overflow-hidden rounded-2xl bg-mamalog-sub/25">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-mamalog-text">終日</p>
              <p className="mt-0.5 text-[10.5px] text-mamalog-muted">時間を指定しません</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={allDay}
              onClick={handleAllDayToggle}
              className={`relative h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors ${
                allDay ? "bg-mamalog-main" : "bg-mamalog-muted/40"
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                  allDay ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="border-t border-black/[0.05] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold text-mamalog-text">開始</p>
              <div className="flex flex-1 justify-end gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-mamalog-text shadow-sm ring-1 ring-black/[0.06] outline-none focus:ring-mamalog-main/40"
                />
                {!allDay ? (
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-semibold tabular-nums text-mamalog-text shadow-sm ring-1 ring-black/[0.06] outline-none focus:ring-mamalog-main/40"
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className="border-t border-black/[0.05] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold text-mamalog-text">終了</p>
              <div className="flex flex-1 justify-end gap-2">
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-mamalog-text shadow-sm ring-1 ring-black/[0.06] outline-none focus:ring-mamalog-main/40"
                />
                {!allDay ? (
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-semibold tabular-nums text-mamalog-text shadow-sm ring-1 ring-black/[0.06] outline-none focus:ring-mamalog-main/40"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {isInvalidRange ? (
            <div className="border-t border-black/[0.05] px-4 py-2">
              <p className="text-[10.5px] font-semibold text-[#D9614E]">
                終了日時は開始日時より後に設定してください
              </p>
            </div>
          ) : null}
        </section>

        {/* カレンダーのカテゴリー（このセクションのみ編集 UI を持つ） */}
        <section className="mt-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold text-mamalog-muted">カレンダーのカテゴリー</p>
            <button
              type="button"
              aria-label={categorySectionEditing ? "カテゴリの編集を完了" : "カテゴリを編集"}
              aria-pressed={categorySectionEditing}
              onClick={toggleCategorySectionEditing}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-black/[0.06] transition active:scale-95 ${
                categorySectionEditing
                  ? "bg-mamalog-main text-white ring-mamalog-main/30 hover:bg-[#ff6b80]"
                  : "bg-mamalog-sub/50 text-mamalog-text hover:bg-mamalog-sub/80"
              }`}
            >
              {categorySectionEditing ? <CategorySectionCheckIcon /> : <CategorySectionPencilIcon />}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => {
              const on = categoryId === c.id;
              const canDelete = categories.length > 1;

              if (categorySectionEditing) {
                return (
                  <div
                    key={c.id}
                    className="flex min-w-0 flex-[1_1_calc(50%-4px)] items-center gap-1.5 rounded-xl bg-white px-2 py-2 ring-1 ring-black/[0.06]"
                    style={{
                      boxShadow: on ? `0 0 0 2px ${c.color}` : undefined,
                    }}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: c.color }}
                      aria-hidden
                    />
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => onRenameCategory(c.id, e.target.value)}
                      onBlur={(e) => {
                        const t = e.target.value.trim();
                        onRenameCategory(c.id, t.length > 0 ? t : "未設定");
                      }}
                      maxLength={24}
                      className="min-w-0 flex-1 rounded-lg bg-mamalog-sub/25 px-2 py-1 text-[12.5px] font-semibold text-mamalog-text outline-none ring-0 placeholder:text-mamalog-muted/70 focus:bg-white focus:ring-1 focus:ring-mamalog-main/35"
                      aria-label={`カテゴリ名を編集: ${c.name}`}
                    />
                    <button
                      type="button"
                      disabled={!canDelete}
                      aria-label={`カテゴリ「${c.name}」を削除`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!canDelete) return;
                        onDeleteCategory(c.id);
                      }}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold leading-none transition ${
                        canDelete
                          ? "bg-[#FBE0E0]/80 text-[#D9614E] hover:bg-[#FBE0E0] active:scale-95"
                          : "cursor-not-allowed bg-mamalog-sub/30 text-mamalog-muted/45"
                      }`}
                    >
                      ×
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  aria-pressed={on}
                  className="flex min-w-0 flex-[1_1_calc(50%-4px)] items-center gap-2 rounded-xl px-3 py-2.5 text-left transition active:scale-[0.98]"
                  style={{
                    backgroundColor: on ? c.bg : "#FFFFFF",
                    boxShadow: on ? `0 0 0 2px ${c.color}` : "0 0 0 1px rgba(0,0,0,0.06)",
                  }}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                    aria-hidden
                  />
                  <span
                    className={`${on ? "font-bold" : "font-semibold"} truncate text-[12.5px] text-mamalog-text`}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCategorySheetOpen(true)}
              className="flex min-h-[44px] min-w-0 flex-[1_1_calc(50%-4px)] items-center justify-center gap-1.5 rounded-xl border border-dashed border-mamalog-main/40 bg-mamalog-sub/20 px-3 py-2.5 text-[12.5px] font-bold text-mamalog-main transition hover:bg-mamalog-sub/40 active:scale-[0.98]"
            >
              <span className="text-base leading-none">＋</span>
              <span>カテゴリを追加</span>
            </button>
          </div>
          {categorySectionEditing ? (
            <button
              type="button"
              onClick={() => {
                const id = onQuickAddCategory();
                setCategoryId(id);
              }}
              className="mt-2 rounded-xl bg-mamalog-sub/35 px-3 py-2 text-[11px] font-bold text-mamalog-main ring-1 ring-mamalog-main/20 transition hover:bg-mamalog-sub/55 active:scale-[0.99]"
            >
              ＋ 新規カテゴリ（色は自動で追加）
            </button>
          ) : null}
        </section>

        {/* メンバー */}
        {members.length > 0 ? (
          <section className="mt-5">
            <p className="text-[11px] font-bold text-mamalog-muted">メンバー</p>
            <div className="custom-scrollbar mt-3 flex gap-2 overflow-x-auto px-1 py-2">
              {members.map((m) => {
                const on = memberId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMemberId(m.id)}
                    className="flex min-w-[64px] flex-col items-center gap-1.5 transition active:scale-95"
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full text-xl"
                      style={{
                        backgroundColor: m.avatarImage ? "transparent" : m.avatarBg,
                        boxShadow: on
                          ? `0 0 0 2px white, 0 0 0 4px ${m.colorHex}`
                          : "0 0 0 1px rgba(0,0,0,0.06)",
                      }}
                    >
                      {m.avatarImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.avatarImage}
                          alt={m.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{m.avatar}</span>
                      )}
                    </span>
                    <span
                      className="block max-w-[64px] truncate text-[10.5px] font-bold leading-tight"
                      style={{ color: on ? m.colorHex : "#9A8A8A" }}
                    >
                      {m.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* メモ */}
        <section className="mt-5">
          <label htmlFor="scheduleMemo" className="text-[11px] font-bold text-mamalog-muted">
            メモ
          </label>
          <textarea
            id="scheduleMemo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="持ち物、注意点、リンクなどをメモ"
            rows={3}
            maxLength={300}
            className="mt-1.5 w-full resize-none rounded-xl border border-black/[0.08] bg-mamalog-sub/30 px-3 py-2.5 text-[13px] leading-relaxed text-mamalog-text caret-mamalog-main outline-none transition focus:border-mamalog-main/50 focus:bg-white"
          />
          <p className="mt-1 text-right text-[10px] tabular-nums text-mamalog-muted/80">
            {memo.length} / 300
          </p>
        </section>

        <PrimaryButton
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="mt-3 w-full py-3 text-[14px]"
        >
          {ctaLabel}
        </PrimaryButton>

        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            className="mt-2 w-full rounded-full px-5 py-3 text-[13px] font-bold text-[#D9614E] transition hover:bg-[#FBE0E0]/40 active:bg-[#FBE0E0]/60"
          >
            この予定を削除
          </button>
        ) : null}
      </div>

      {categorySheetOpen ? (
        <AddCategorySheet
          onClose={() => setCategorySheetOpen(false)}
          onSave={handleSaveCategory}
        />
      ) : null}
    </div>
  );
}
