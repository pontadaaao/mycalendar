"use client";

import { useState } from "react";
import { TASK_FORM_PALETTE, type TaskCategoryItem } from "@/lib/task-form-types";
import { ColorPicker } from "./ColorPicker";
import { PrimaryButton } from "../PrimaryButton";

type CategoryAddModalProps = {
  onClose: () => void;
  onAdd: (cat: TaskCategoryItem) => void;
};

export function CategoryAddModal({ onClose, onAdd }: CategoryAddModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(TASK_FORM_PALETTE[0].hex);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ id: `tc-${Date.now()}`, name: trimmed, color });
    onClose();
  }

  return (
    <div className="absolute inset-0 z-[120] flex flex-col justify-end" role="dialog" aria-modal="true">
      <button type="button" aria-label="閉じる" className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative mx-auto w-full max-w-[390px] rounded-t-[24px] bg-white px-5 pb-8 pt-4 shadow-[0_-16px_48px_rgba(58,42,42,0.15)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-black/[0.12]" aria-hidden />
        <h2 className="text-center text-[16px] font-bold text-mamalog-text">新しいカテゴリ</h2>
        <div className="mt-5">
          <label htmlFor="newCatName" className="text-[11px] font-bold text-mamalog-muted">
            カテゴリ名
          </label>
          <input
            id="newCatName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：健康・趣味"
            maxLength={16}
            className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-[#FFF9F7] px-4 py-3 text-[14px] font-semibold text-mamalog-text outline-none ring-[#FF7F91]/0 transition focus:border-[#FF7F91]/45 focus:bg-white focus:ring-4 focus:ring-[#FFE8E8]"
          />
        </div>
        <div className="mt-5">
          <p className="text-[11px] font-bold text-mamalog-muted">カラー</p>
          <div className="mt-2">
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>
        <PrimaryButton type="button" onClick={submit} disabled={!name.trim()} className="mt-7 w-full py-3.5 text-[15px]">
          追加
        </PrimaryButton>
      </div>
    </div>
  );
}
