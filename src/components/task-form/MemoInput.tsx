"use client";

type MemoInputProps = {
  value: string;
  onChange: (v: string) => void;
};

export function MemoInput({ value, onChange }: MemoInputProps) {
  return (
    <section className="rounded-[18px] border border-black/[0.06] bg-white p-4 shadow-[0_8px_28px_-12px_rgba(58,42,42,0.12)]">
      <label htmlFor="taskMemo" className="text-[11px] font-bold tracking-[0.06em] text-mamalog-muted">
        メモ
      </label>
      <textarea
        id="taskMemo"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例：牛乳と卵も買う"
        rows={4}
        className="mt-2 min-h-[100px] w-full resize-y rounded-2xl border border-black/[0.08] bg-[#FFF9F7] px-4 py-3 text-[14px] font-medium leading-relaxed text-mamalog-text outline-none ring-[#FF7F91]/0 transition focus:border-[#FF7F91]/40 focus:bg-white focus:ring-4 focus:ring-[#FFE8E8]"
      />
    </section>
  );
}
