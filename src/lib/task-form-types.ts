/** タスク作成フォーム用（スケジュールの ScheduleCategory とは別） */

export type TaskCategoryItem = {
  id: string;
  name: string;
  /** アクセント用 hex */
  color: string;
};

export type TaskRepeatKind = "none" | "daily" | "weekly" | "monthly";

export type TaskPriorityKind = "low" | "normal" | "high";

export type TaskNotificationKind = "none" | "same_day" | "day_before" | "time";

export type TaskDueKind = "today" | "tomorrow" | "pick" | "none";

export type TaskFormPaletteEntry = {
  id: string;
  hex: string;
  label: string;
};

/** カラー選択チップ（カテゴリ追加時と共通） */
export const TASK_FORM_PALETTE: TaskFormPaletteEntry[] = [
  { id: "pink", hex: "#FF7F91", label: "ピンク" },
  { id: "blue", hex: "#8EB8FF", label: "ブルー" },
  { id: "green", hex: "#9BD6A3", label: "グリーン" },
  { id: "orange", hex: "#F5B36B", label: "オレンジ" },
  { id: "purple", hex: "#B7A3E8", label: "パープル" },
  { id: "yellow", hex: "#F6D365", label: "イエロー" },
];

export const DEFAULT_TASK_CATEGORIES: TaskCategoryItem[] = [
  { id: "tc-house", name: "家事", color: "#FF7F91" },
  { id: "tc-work", name: "仕事", color: "#8EB8FF" },
  { id: "tc-child", name: "育児", color: "#9BD6A3" },
];

export type NewTaskPayload = {
  title: string;
  categoryId: string | null;
  dueKind: TaskDueKind;
  dueDateISO: string | null;
  repeat: TaskRepeatKind;
  priority: TaskPriorityKind;
  memo: string;
  notification: TaskNotificationKind;
  notificationTime: string | null;
};
