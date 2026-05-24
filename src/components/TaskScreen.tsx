"use client";

import { Card } from "./Card";
import { PrimaryButton } from "./PrimaryButton";
import type { TaskItem } from "@/lib/mamalog";

type TaskFilter = "today" | "all";

type TaskScreenProps = {
  filter: TaskFilter;
  onFilter: (f: TaskFilter) => void;
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
};

export function TaskScreen({
  filter,
  onFilter,
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
}: TaskScreenProps) {
  const visible =
    filter === "today"
      ? tasks
      : [...tasks].sort((a, b) => Number(a.done) - Number(b.done));

  return (
    <div className="flex flex-col gap-5 pb-12 pt-4">
      <div
        className="mx-auto flex w-full rounded-full bg-mamalog-sub/40 p-1"
        role="tablist"
        aria-label="タスク表示"
      >
        {(
          [
            { id: "today" as const, label: "今日のタスク" },
            { id: "all" as const, label: "すべてのタスク" },
          ] satisfies { id: TaskFilter; label: string }[]
        ).map((p) => {
          const on = filter === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onFilter(p.id)}
              className={`flex-1 rounded-full px-3 py-2 text-[12px] font-semibold transition-colors ${
                on ? "bg-mamalog-main text-white shadow-sm" : "text-mamalog-muted hover:text-mamalog-text/80"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <Card className="!px-0 !py-0">
        <ul className="divide-y divide-black/[0.05]">
          {visible.length === 0 ? (
            <li className="px-5 py-10 text-center text-[12px] text-mamalog-muted">タスクはありません</li>
          ) : (
            visible.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onToggleTask(t.id)}
                  aria-pressed={t.done}
                  className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-md border-[1.5px] transition-colors ${
                    t.done
                      ? "border-mamalog-green bg-mamalog-green/30"
                      : "border-black/15 bg-white"
                  }`}
                >
                  {t.done ? <span className="text-[11px] leading-none">✓</span> : null}
                </button>
                {t.categoryColor ? (
                  <span
                    className="h-9 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: t.categoryColor }}
                    aria-hidden
                  />
                ) : null}
                <p
                  className={`min-w-0 flex-1 truncate text-[14px] font-semibold ${
                    t.done ? "text-mamalog-muted line-through" : "text-mamalog-text"
                  }`}
                >
                  {t.title}
                </p>
                <button
                  type="button"
                  aria-label="タスクを編集"
                  onClick={() => onEditTask(t)}
                  className="ml-1 shrink-0 rounded-lg p-1.5 text-mamalog-muted/80 transition hover:bg-mamalog-sub/50 hover:text-mamalog-text"
                >
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
                </button>
              </li>
            ))
          )}
        </ul>
      </Card>

      <PrimaryButton onClick={onAddTask} className="w-full py-3 text-[14px]">
        ＋ タスクを追加
      </PrimaryButton>
    </div>
  );
}
