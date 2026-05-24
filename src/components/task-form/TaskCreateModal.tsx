"use client";

import { useEffect, useState } from "react";
import type { TaskItem } from "@/lib/mamalog";
import type {
  NewTaskPayload,
  TaskCategoryItem,
  TaskDueKind,
  TaskNotificationKind,
  TaskPriorityKind,
  TaskRepeatKind,
} from "@/lib/task-form-types";
import { getTaskFormInitialState } from "@/lib/task-form-from-task";
import { PrimaryButton } from "../PrimaryButton";
import { TaskTitleInput } from "./TaskTitleInput";
import { TaskCategorySelector } from "./TaskCategorySelector";
import { CategoryAddModal } from "./CategoryAddModal";
import { DueDateSelector } from "./DueDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { PrioritySelector } from "./PrioritySelector";
import { MemoInput } from "./MemoInput";
import { NotificationSelector } from "./NotificationSelector";

type TaskCreateModalProps = {
  categories: TaskCategoryItem[];
  setCategories: React.Dispatch<React.SetStateAction<TaskCategoryItem[]>>;
  /** 編集対象。未指定で新規作成 */
  editingTask?: TaskItem | null;
  onClose: () => void;
  /** 第2引数は編集中タスクの ID（新規は省略） */
  onSave: (payload: NewTaskPayload, editingTaskId?: string) => void;
  onDelete?: () => void;
};

export function TaskCreateModal({
  categories,
  setCategories,
  editingTask = null,
  onClose,
  onSave,
  onDelete,
}: TaskCreateModalProps) {
  const initial = getTaskFormInitialState(editingTask ?? undefined, categories);
  const [title, setTitle] = useState(initial.title);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initial.selectedCategoryId,
  );
  const [dueKind, setDueKind] = useState<TaskDueKind>(initial.dueKind);
  const [pickedDueISO, setPickedDueISO] = useState(initial.pickedDueISO);
  const [repeat, setRepeat] = useState<TaskRepeatKind>(initial.repeat);
  const [priority, setPriority] = useState<TaskPriorityKind>(initial.priority);
  const [memo, setMemo] = useState(initial.memo);
  const [notification, setNotification] = useState<TaskNotificationKind>(initial.notification);
  const [notifyTime, setNotifyTime] = useState(initial.notifyTime);
  const [categoryAddOpen, setCategoryAddOpen] = useState(false);

  const isEdit = Boolean(editingTask);

  useEffect(() => {
    if (!categories.some((c) => c.id === selectedCategoryId)) {
      const fallback = categories[0]?.id ?? null;
      setSelectedCategoryId(fallback);
    }
  }, [categories, selectedCategoryId]);

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    const payload: NewTaskPayload = {
      title: trimmed,
      categoryId: selectedCategoryId,
      dueKind,
      dueDateISO: dueKind === "pick" ? pickedDueISO : null,
      repeat,
      priority,
      memo,
      notification,
      notificationTime: notification === "time" ? notifyTime : null,
    };
    onSave(payload, editingTask?.id);
  }

  const saveDisabled = !title.trim();

  return (
    <div className="absolute inset-0 z-50 flex min-h-0 flex-col" role="dialog" aria-modal="true">
      <button type="button" aria-label="閉じる" className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative mt-auto flex max-h-[min(88dvh,92%)] min-h-0 w-full flex-col overflow-hidden rounded-t-[28px] bg-[#FFF9F7] shadow-[0_-24px_60px_-16px_rgba(58,42,42,0.28)]">
        <div className="flex shrink-0 flex-col items-center px-4 pb-2 pt-3">
          <div className="mb-3 h-1 w-10 rounded-full bg-black/[0.12]" aria-hidden />
          <div className="relative flex w-full items-center justify-center py-0.5">
            <button
              type="button"
              onClick={onClose}
              className="absolute left-0 rounded-full px-3 py-1.5 text-[13px] font-semibold text-mamalog-muted transition hover:bg-black/[0.05] hover:text-mamalog-text"
            >
              キャンセル
            </button>
            <h1 className="text-center text-[16px] font-bold tracking-tight text-mamalog-text">
              {isEdit ? "タスクを編集" : "新しいタスク"}
            </h1>
          </div>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 [-webkit-overflow-scrolling:touch]">
          <div className="flex flex-col gap-4 pb-4 pt-1">
            <TaskTitleInput value={title} onChange={setTitle} />

            <TaskCategorySelector
              categories={categories}
              setCategories={setCategories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategoryId={setSelectedCategoryId}
              onOpenAddModal={() => setCategoryAddOpen(true)}
            />

            <DueDateSelector
              dueKind={dueKind}
              onDueKind={setDueKind}
              pickedISO={pickedDueISO}
              onPickedISO={setPickedDueISO}
            />

            <RepeatSelector value={repeat} onChange={setRepeat} />

            <PrioritySelector value={priority} onChange={setPriority} />

            <MemoInput value={memo} onChange={setMemo} />

            <NotificationSelector
              value={notification}
              onChange={setNotification}
              timeValue={notifyTime}
              onTimeChange={setNotifyTime}
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-black/[0.06] bg-[#FFF9F7] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
          <div className="flex flex-col gap-3">
            <PrimaryButton
              type="button"
              disabled={saveDisabled}
              onClick={submit}
              className="w-full py-3.5 text-[15px] shadow-lg shadow-[#FF7F91]/20"
            >
              {isEdit ? "変更を保存" : "タスクを保存"}
            </PrimaryButton>
            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="w-full bg-transparent py-2 text-[13px] font-semibold text-[#D9614E] transition hover:text-[#c04538] hover:underline active:opacity-70"
              >
                削除する
              </button>
            ) : null}
          </div>
        </div>

        {categoryAddOpen ? (
          <CategoryAddModal
            onClose={() => setCategoryAddOpen(false)}
            onAdd={(cat) => {
              setCategories((prev) => [...prev, cat]);
              setSelectedCategoryId(cat.id);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
