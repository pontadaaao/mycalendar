"use client";

import type { Member } from "@/lib/mamalog";

type MemberTabsProps = {
  members: Member[];
  /** 選択中のメンバーID。null は「絞り込みなし／全員」 */
  selectedId: string | null;
  /** 同じIDをタップしたら null に戻す（解除）UXを想定 */
  onSelect: (id: string | null) => void;
};

export function MemberTabs({ members, selectedId, onSelect }: MemberTabsProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-0 top-0 z-[1] h-full w-8 bg-gradient-to-l from-mamalog-bg to-transparent" />
      <div
        className="flex snap-x gap-4 overflow-x-auto pb-1 pl-0.5 pr-1 pt-2"
        aria-label="家族メンバー"
        style={{ scrollbarWidth: "none" }}
      >
        {members.map((m) => {
          const sel = selectedId === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(sel ? null : m.id)}
              aria-pressed={sel}
              className="group flex w-[calc((100%-40px)/3)] shrink-0 snap-start flex-col items-center gap-1 transition active:scale-95"
            >
              <span
                className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full text-2xl transition"
                style={{
                  backgroundColor: m.avatarImage ? "transparent" : m.avatarBg,
                  boxShadow: sel ? `0 0 0 2px ${m.colorHex}` : "0 0 0 1px rgba(0,0,0,0.04)",
                }}
              >
                {m.avatarImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatarImage} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{m.avatar}</span>
                )}
              </span>
              <span
                title={m.name}
                className={`block w-full truncate px-1 text-center text-[12px] font-bold leading-tight ${
                  sel ? "text-mamalog-text" : "text-mamalog-muted"
                }`}
              >
                {m.name}
              </span>
              <span
                className={`h-[3px] w-7 rounded-full transition-colors ${
                  sel ? "bg-mamalog-main" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
