import type { TaskItem } from "@/lib/mamalog";
import { toISODate } from "@/lib/mamalog";
import { addDaysToISO } from "@/lib/dates";
import type {
  TaskCategoryItem,
  TaskDueKind,
  TaskNotificationKind,
  TaskPriorityKind,
  TaskRepeatKind,
} from "@/lib/task-form-types";

const FORM_REPEAT_IDS: TaskRepeatKind[] = ["none", "daily", "weekly", "monthly"];
const PRIORITY_IDS: TaskPriorityKind[] = ["low", "normal", "high"];

export function dueKindFromStoredDueISO(dueISO: string | null | undefined): {
  dueKind: TaskDueKind;
  pickedDueISO: string;
} {
  const today = toISODate(new Date());
  const tomorrow = addDaysToISO(today, 1);
  if (!dueISO) return { dueKind: "none", pickedDueISO: today };
  if (dueISO === today) return { dueKind: "today", pickedDueISO: dueISO };
  if (dueISO === tomorrow) return { dueKind: "tomorrow", pickedDueISO: dueISO };
  return { dueKind: "pick", pickedDueISO: dueISO };
}

export function notificationFromStored(stored?: string | null): {
  notification: TaskNotificationKind;
  notifyTime: string;
} {
  const defaults = { notification: "none" as TaskNotificationKind, notifyTime: "09:00" };
  if (!stored || stored === "none") return defaults;
  if (stored.startsWith("time:")) {
    const t = stored.slice(5);
    return { notification: "time", notifyTime: t || "09:00" };
  }
  if (stored === "same_day" || stored === "day_before") {
    return { notification: stored, notifyTime: "09:00" };
  }
  return defaults;
}

/** 新規は editingTask 省略。編集時はタスクを渡してフォーム初期値を得る */
export function getTaskFormInitialState(
  editingTask: TaskItem | undefined,
  categories: TaskCategoryItem[],
) {
  const todayPick = toISODate(new Date());
  if (!editingTask) {
    return {
      title: "",
      selectedCategoryId: categories[0]?.id ?? null,
      dueKind: "none" as TaskDueKind,
      pickedDueISO: todayPick,
      repeat: "none" as TaskRepeatKind,
      priority: "normal" as TaskPriorityKind,
      memo: "",
      notification: "none" as TaskNotificationKind,
      notifyTime: "09:00",
    };
  }

  const { dueKind, pickedDueISO } = dueKindFromStoredDueISO(editingTask.dueDateISO);
  const { notification, notifyTime } = notificationFromStored(editingTask.notification);
  const repeat = FORM_REPEAT_IDS.includes(editingTask.repeat as TaskRepeatKind)
    ? (editingTask.repeat as TaskRepeatKind)
    : "none";
  const priority = PRIORITY_IDS.includes(editingTask.priority as TaskPriorityKind)
    ? (editingTask.priority as TaskPriorityKind)
    : "normal";

  return {
    title: editingTask.title,
    selectedCategoryId: editingTask.categoryId ?? categories[0]?.id ?? null,
    dueKind,
    pickedDueISO,
    repeat,
    priority,
    memo: editingTask.memo ?? "",
    notification,
    notifyTime,
  };
}
