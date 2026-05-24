"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Member } from "@/lib/mamalog";

function PencilIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16.5 3.5l4 4L8 20l-5 1 1-5z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="20"
      height="20"
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
  );
}

function PersonPlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}

export type AppTabHeaderProps = {
  title: string;
  members: Member[];
  selectedMemberId: string | null;
  showAddSchedule?: boolean;
  onAddSchedule?: () => void;
  onAddMember: () => void;
  onEditMember: (memberId: string) => void;
  onDeleteMember: (memberId: string) => void;
};

export function AppTabHeader({
  title,
  members,
  selectedMemberId,
  showAddSchedule,
  onAddSchedule,
  onAddMember,
  onEditMember,
  onDeleteMember,
}: AppTabHeaderProps) {
  const selectedMember = useMemo(
    () => (selectedMemberId ? members.find((m) => m.id === selectedMemberId) ?? null : null),
    [members, selectedMemberId],
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  function handleEditClick() {
    setMenuOpen(false);
    if (selectedMember) onEditMember(selectedMember.id);
  }

  function handleDeleteClick() {
    setMenuOpen(false);
    if (!selectedMember) return;
    if (window.confirm(`${selectedMember.name}さんを削除しますか？\nこの操作は元に戻せません。`)) {
      onDeleteMember(selectedMember.id);
    }
  }

  function handleAddMemberMenuClick() {
    setMenuOpen(false);
    onAddMember();
  }

  return (
    <header
      className={`relative flex min-h-[44px] items-center gap-2 py-3 ${menuOpen ? "z-[100]" : ""}`}
    >
      <div className="flex min-w-0 flex-1 items-center justify-start">
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={
              selectedMember
                ? `${selectedMember.name}さんのメニューを開く`
                : "メンバーメニューを開く"
            }
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full text-[22px] ring-1 ring-black/[0.05] outline-none transition hover:opacity-95 active:scale-[0.96] ${
              !selectedMember ? "bg-mamalog-sub/35" : selectedMember.avatarImage ? "bg-transparent" : ""
            } ${menuOpen ? "ring-2 ring-mamalog-main/50 ring-offset-2 ring-offset-[#FFF9FA]" : ""}`}
            style={
              selectedMember && !selectedMember.avatarImage
                ? { backgroundColor: selectedMember.avatarBg }
                : selectedMember?.avatarImage
                  ? { backgroundColor: "transparent" }
                  : undefined
            }
          >
            {selectedMember?.avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedMember.avatarImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : selectedMember ? (
              <span aria-hidden>{selectedMember.avatar}</span>
            ) : (
              <span className="text-[13px] font-bold text-mamalog-muted/65" aria-hidden>
                —
              </span>
            )}
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute left-0 top-full z-[101] mt-1 w-[210px] overflow-hidden rounded-[18px] border border-black/[0.06] bg-white/94 shadow-[0_10px_30px_-8px_rgba(58,42,42,0.12)] backdrop-blur-xl"
            >
              <p className="px-4 pt-3 pb-1 text-[10.5px] font-bold text-mamalog-muted">
                {selectedMember ? `選択中：${selectedMember.name}さん` : "メンバーを選択中ではありません"}
              </p>
              <button
                type="button"
                role="menuitem"
                onClick={handleAddMemberMenuClick}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-semibold text-mamalog-text transition hover:bg-mamalog-sub/40"
              >
                <PersonPlusIcon />
                <span>メンバーの追加</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleEditClick}
                disabled={!selectedMember}
                className="flex w-full items-center gap-3 border-t border-black/[0.05] px-4 py-3 text-left text-[13px] font-semibold text-mamalog-text transition hover:bg-mamalog-sub/40 disabled:cursor-not-allowed disabled:text-mamalog-muted/60 disabled:hover:bg-transparent"
              >
                <PencilIcon />
                <span>メンバーを編集</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleDeleteClick}
                disabled={!selectedMember}
                className="flex w-full items-center gap-3 border-t border-black/[0.05] px-4 py-3 text-left text-[13px] font-semibold text-[#D9614E] transition hover:bg-[#FBE0E0]/40 disabled:cursor-not-allowed disabled:text-mamalog-muted/60 disabled:hover:bg-transparent"
              >
                <TrashIcon />
                <span>メンバーを削除</span>
              </button>
              {!selectedMember ? (
                <p className="border-t border-black/[0.05] px-4 py-2.5 text-[10.5px] leading-relaxed text-mamalog-muted">
                  まずメンバータブから対象を選んでください。
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <h1 className="pointer-events-none shrink-0 px-1 text-center text-[16px] font-bold tracking-tight text-mamalog-text">
        {title}
      </h1>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
        {showAddSchedule ? (
          <button
            type="button"
            aria-label="予定を追加"
            onClick={() => onAddSchedule?.()}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-mamalog-sub/50 text-mamalog-main outline-none transition hover:bg-mamalog-sub/75 focus:outline-none focus-visible:outline-none active:scale-[0.94]"
          >
            <PlusIcon />
          </button>
        ) : null}
      </div>
    </header>
  );
}
