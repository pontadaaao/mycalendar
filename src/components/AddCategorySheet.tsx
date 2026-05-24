"use client";

import { useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { MEMBER_COLOR_PALETTE, type MemberColor } from "@/lib/mamalog";

export type AddCategoryPayload = {
  name: string;
  color: string;
  bg: string;
};

type AddCategorySheetProps = {
  onClose: () => void;
  onSave: (payload: AddCategoryPayload) => void;
};

export function AddCategorySheet({ onClose, onSave }: AddCategorySheetProps) {
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<MemberColor>(MEMBER_COLOR_PALETTE[6]);

  const canSave = name.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    onSave({ name: name.trim(), color: picked.colorHex, bg: picked.avatarBg });
  }

  return (
    <div
      className="absolute inset-0 z-[60] flex min-h-0 flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="新しいカテゴリー"
    >
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative mt-auto flex max-h-[88%] min-h-0 w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-12px_30px_rgba(0,0,0,0.18)]">
        <div className="shrink-0 px-5 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-mamalog-muted/30" aria-hidden />
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-[13px] font-semibold text-mamalog-muted hover:text-mamalog-text"
            >
              キャンセル
            </button>
            <h2 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[15px] font-bold text-mamalog-text">
              新しいカテゴリー
            </h2>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="ml-auto text-[13px] font-bold text-mamalog-main disabled:opacity-40"
            >
              保存
            </button>
          </div>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-2">
          {/* プレビュー */}
          <div className="flex justify-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors"
              style={{ backgroundColor: picked.avatarBg, color: picked.colorHex }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: picked.colorHex }}
              />
              {name.trim() || "カテゴリー名"}
            </span>
          </div>

          <div className="mt-5">
            <label htmlFor="categoryName" className="text-[11px] font-bold text-mamalog-muted">
              カテゴリー名
            </label>
            <input
              id="categoryName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：ピアノ / 学校行事"
              maxLength={16}
              className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-mamalog-sub/30 px-3 py-2.5 text-[14px] font-semibold text-mamalog-text caret-mamalog-main outline-none transition focus:border-mamalog-main/50 focus:bg-white"
            />
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-bold text-mamalog-muted">カラー</p>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {MEMBER_COLOR_PALETTE.map((c) => {
                const on = c.colorHex === picked.colorHex;
                return (
                  <button
                    key={c.colorHex}
                    type="button"
                    aria-label={`カラー：${c.label}`}
                    aria-pressed={on}
                    onClick={() => setPicked(c)}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full transition active:scale-95"
                    style={{
                      backgroundColor: c.colorHex,
                      boxShadow: on
                        ? `0 0 0 2px #ffffff, 0 0 0 4px ${c.colorHex}`
                        : "0 0 0 1px rgba(0,0,0,0.06)",
                    }}
                  >
                    {on ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="white"
                        strokeWidth={2.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M5 10.5l3 3 7-7" />
                      </svg>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <PrimaryButton
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="mt-6 w-full py-3 text-[14px]"
          >
            このカテゴリーを追加
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
