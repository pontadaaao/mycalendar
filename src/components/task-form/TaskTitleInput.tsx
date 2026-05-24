"use client";

type TaskTitleInputProps = {
  value: string;
  onChange: (v: string) => void;
};

export function TaskTitleInput({ value, onChange }: TaskTitleInputProps) {
  return (
    <section className="rounded-[18px] border border-black/[0.06] bg-white p-4 shadow-[0_8px_28px_-12px_rgba(58,42,42,0.12)]">
      <label htmlFor="taskTitle" className="text-[11px] font-bold tracking-[0.06em] text-mamalog-muted">
        タスク名
      </label>
      <input
        id="taskTitle"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例：ゴミ出し、買い物、病院予約"
        maxLength={120}
        required
        className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-[#FFF9F7] px-4 py-3.5 text-[15px] font-semibold text-mamalog-text outline-none ring-[#FF7F91]/0 transition focus:border-[#FF7F91]/40 focus:bg-white focus:ring-4 focus:ring-[#FFE8E8]"
      />
    </section>
  );
}
