"use client";

type CategoryEditorProps = {
  editing: boolean;
  onToggleEditing: () => void;
};

/** カテゴリ見出し横の編集／完了トグル */
export function CategoryEditor({ editing, onToggleEditing }: CategoryEditorProps) {
  return (
    <button
      type="button"
      onClick={onToggleEditing}
      aria-label={editing ? "編集を完了" : "カテゴリを編集"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mamalog-muted transition hover:bg-black/[0.04] hover:text-mamalog-text"
    >
      {editing ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M5 12.5l4 4L19 6.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          <path d="M16.5 3.5l4 4L8 20l-5 1 1-5z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.5 6.5l4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
