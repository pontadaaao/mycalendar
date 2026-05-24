"use client";

import { useState } from "react";
import { CategoryChip } from "./CategoryChip";
import { CategoryEditor } from "./CategoryEditor";
import type { TaskCategoryItem } from "@/lib/task-form-types";

type TaskCategorySelectorProps = {
  categories: TaskCategoryItem[];
  setCategories: React.Dispatch<React.SetStateAction<TaskCategoryItem[]>>;
  selectedCategoryId: string | null;
  onSelectCategoryId: (id: string) => void;
  onOpenAddModal: () => void;
};

export function TaskCategorySelector({
  categories,
  setCategories,
  selectedCategoryId,
  onSelectCategoryId,
  onOpenAddModal,
}: TaskCategorySelectorProps) {
  const [editing, setEditing] = useState(false);

  function removeCategory(id: string) {
    if (categories.length <= 1) return;
    const next = categories.filter((c) => c.id !== id);
    setCategories(next);
    if (selectedCategoryId === id && next[0]) {
      onSelectCategoryId(next[0].id);
    }
  }

  function updateCategoryName(id: string, name: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    );
  }

  return (
    <section className="rounded-[18px] border border-black/[0.06] bg-white p-4 shadow-[0_8px_28px_-12px_rgba(58,42,42,0.12)]">
      <div className="relative flex min-h-9 items-center pr-11">
        <p className="text-[11px] font-bold tracking-[0.06em] text-mamalog-muted">カテゴリ</p>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <CategoryEditor
            editing={editing}
            onToggleEditing={() => setEditing((e) => !e)}
          />
        </div>
      </div>

      {!editing ? (
        <div className="relative mt-3 -mx-1">
          <div className="flex gap-2 overflow-x-auto pb-1 px-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((c) => (
              <CategoryChip
                key={c.id}
                name={c.name}
                color={c.color}
                selected={selectedCategoryId === c.id}
                onClick={() => onSelectCategoryId(c.id)}
              />
            ))}
            <button
              type="button"
              onClick={onOpenAddModal}
              aria-label="カテゴリを追加"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE8E8] text-[20px] font-light leading-none text-[#FF7F91] shadow-sm ring-1 ring-[#FF7F91]/15 transition hover:bg-[#FFDEDE] active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2 rounded-2xl bg-[#FFF9F7] px-2 py-1.5 ring-1 ring-black/[0.05]">
              <span
                className="h-8 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: c.color }}
                aria-hidden
              />
              <input
                value={c.name}
                maxLength={16}
                onChange={(e) => updateCategoryName(c.id, e.target.value)}
                className="min-w-0 flex-1 rounded-xl bg-transparent px-2 py-2 text-[13px] font-semibold text-mamalog-text outline-none focus:bg-white"
              />
              <button
                type="button"
                disabled={categories.length <= 1}
                onClick={() => removeCategory(c.id)}
                aria-label={`${c.name}を削除`}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg leading-none transition ${
                  categories.length <= 1
                    ? "cursor-not-allowed text-mamalog-muted/35"
                    : "text-mamalog-muted hover:bg-black/[0.06] hover:text-mamalog-text"
                }`}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#FF7F91]/35 bg-[#FFF9F7] py-2.5 text-[13px] font-semibold text-[#FF7F91] transition hover:bg-[#FFE8E8]/80"
          >
            + カテゴリを追加
          </button>
        </div>
      )}
    </section>
  );
}
