"use client";

type CategoryChipProps = {
  name: string;
  color: string;
  selected: boolean;
  onClick: () => void;
};

export function CategoryChip({ name, color, selected, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center justify-center rounded-full px-3.5 text-[12.5px] font-semibold whitespace-nowrap transition active:scale-[0.97] ${
        selected ? "text-white shadow-md" : "text-mamalog-text/90 shadow-sm ring-1 ring-black/[0.06]"
      }`}
      style={
        selected
          ? { backgroundColor: color, boxShadow: `0 4px 14px -4px ${color}88` }
          : { backgroundColor: `${color}22`, color: "#3a2a2a" }
      }
    >
      {name}
    </button>
  );
}
