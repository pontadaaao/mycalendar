"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "./AppShell";
import { AppTabHeader } from "./AppTabHeader";
import { CalendarScreen } from "./CalendarScreen";
import { TaskScreen } from "./TaskScreen";
import { MoodCalendarScreen } from "./MoodCalendarScreen";
import { AddMemberSheet, type AddMemberPayload } from "./AddMemberSheet";
import { AddSchedulePane, type AddSchedulePayload } from "./AddSchedulePane";
import type { AddCategoryPayload } from "./AddCategorySheet";
import {
  MAX_MEMBER_COUNT,
  MEMBER_COLOR_PALETTE,
  NEW_MEMBER_PALETTE,
  SAMPLE_SCHEDULES,
  SCHEDULE_CATEGORIES,
  toISODate,
  type CalendarGranularity,
  type Member,
  type MoodEntry,
  type ScheduleCategory,
  type ScheduleItem,
  type TabId,
  type TaskItem,
} from "@/lib/mamalog";
import { normalizeSelectedDateInMonth, parseISOLocal, shiftMonthYear } from "@/lib/dates";
import { TaskCreateModal } from "./task-form/TaskCreateModal";
import { resolveDueISO } from "./task-form/DueDateSelector";
import {
  DEFAULT_TASK_CATEGORIES,
  type NewTaskPayload,
  type TaskCategoryItem,
} from "@/lib/task-form-types";

export function MamalogApp() {
  const [tab, setTab] = useState<TabId>("calendar");
  const [calendarView, setCalendarView] = useState<CalendarGranularity>("month");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState(() => toISODate(new Date()));

  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), monthIndex: d.getMonth() };
  });

  /** 週／日表示で日付をまたいだとき、月カレンダーのヘッダとグリッドが選択日と一致するようにする */
  useEffect(() => {
    const d = parseISOLocal(selectedDateISO);
    const y = d.getFullYear();
    const m = d.getMonth();
    setCursor((c) => (c.year === y && c.monthIndex === m ? c : { year: y, monthIndex: m }));
  }, [selectedDateISO]);

  /** デフォルトは空。ユーザーが「メンバー追加」から登録する */
  const [members, setMembers] = useState<Member[]>([]);

  type SheetState = null | { mode: "add" } | { mode: "edit"; member: Member };
  const [sheet, setSheet] = useState<SheetState>(null);

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [taskScope, setTaskScope] = useState<"today" | "all">("today");

  const [schedules, setSchedules] = useState<ScheduleItem[]>(SAMPLE_SCHEDULES);

  type ScheduleSheet = null | { mode: "add" } | { mode: "edit"; schedule: ScheduleItem };
  const [scheduleSheet, setScheduleSheet] = useState<ScheduleSheet>(null);

  type TaskModalState = null | { mode: "create" } | { mode: "edit"; task: TaskItem };

  const [taskModal, setTaskModal] = useState<TaskModalState>(null);
  const [taskCategories, setTaskCategories] = useState<TaskCategoryItem[]>(DEFAULT_TASK_CATEGORIES);

  useEffect(() => {
    if (tab !== "tasks") setTaskModal(null);
  }, [tab]);

  const [categories, setCategories] = useState<ScheduleCategory[]>(SCHEDULE_CATEGORIES);

  function handleScheduleSave(payload: AddSchedulePayload) {
    if (scheduleSheet?.mode === "edit") {
      const editingId = scheduleSheet.schedule.id;
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                title: payload.title,
                location: payload.location,
                memo: payload.memo || undefined,
                dateISO: payload.dateISO,
                time: payload.time,
                endDateISO: payload.endDateISO,
                endTime: payload.endTime,
                allDay: payload.allDay,
                categoryId: payload.categoryId,
                memberId: payload.memberId,
              }
            : s,
        ),
      );
    } else {
      const newSchedule: ScheduleItem = {
        id: `schedule-${Date.now()}`,
        title: payload.title,
        location: payload.location,
        memo: payload.memo || undefined,
        dateISO: payload.dateISO,
        time: payload.time,
        endDateISO: payload.endDateISO,
        endTime: payload.endTime,
        allDay: payload.allDay,
        categoryId: payload.categoryId,
        memberId: payload.memberId,
      };
      setSchedules((prev) => [...prev, newSchedule]);
    }
    setSelectedDateISO(payload.dateISO);
    setScheduleSheet(null);
  }

  function handleScheduleDelete() {
    if (scheduleSheet?.mode !== "edit") return;
    const id = scheduleSheet.schedule.id;
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    setScheduleSheet(null);
  }

  function handleScheduleClick(s: ScheduleItem) {
    setScheduleSheet({ mode: "edit", schedule: s });
  }

  function handleAddCategory(payload: AddCategoryPayload): string {
    const id = `cat-${Date.now()}`;
    const newCategory: ScheduleCategory = {
      id,
      name: payload.name,
      color: payload.color,
      bg: payload.bg,
    };
    setCategories((prev) => [...prev, newCategory]);
    return id;
  }

  function handleRenameCategory(id: string, name: string) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  }

  function handleDeleteCategory(id: string) {
    setCategories((prevCats) => {
      if (prevCats.length <= 1) return prevCats;
      const remaining = prevCats.filter((c) => c.id !== id);
      const fallbackId = remaining[0].id;
      setSchedules((prevSch) =>
        prevSch.map((s) => (s.categoryId === id ? { ...s, categoryId: fallbackId } : s)),
      );
      return remaining;
    });
  }

  function handleQuickAddCategory(): string {
    const id = `cat-${Date.now()}`;
    setCategories((prev) => {
      const slot = MEMBER_COLOR_PALETTE[prev.length % MEMBER_COLOR_PALETTE.length];
      return [
        ...prev,
        { id, name: "新規カテゴリ", color: slot.colorHex, bg: slot.avatarBg },
      ];
    });
    return id;
  }

  /** 追加メンバーには未使用のカラーパレットから順に色を割り当てる */
  const nextPalette = NEW_MEMBER_PALETTE[members.length % NEW_MEMBER_PALETTE.length];

  function handleSheetSave(payload: AddMemberPayload) {
    if (sheet?.mode === "edit") {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === sheet.member.id
            ? {
                ...m,
                name: payload.name,
                avatar: payload.avatar,
                avatarImage: payload.avatarImage,
                colorHex: payload.colorHex,
                avatarBg: payload.avatarBg,
              }
            : m,
        ),
      );
    } else {
      if (members.length >= MAX_MEMBER_COUNT) {
        window.alert(`登録できるのは最大${MAX_MEMBER_COUNT}名までです。`);
        return;
      }
      const newMember: Member = {
        id: `member-${Date.now()}`,
        name: payload.name,
        colorToken: "mamalog-main",
        colorHex: payload.colorHex,
        avatarBg: payload.avatarBg,
        avatar: payload.avatar,
        avatarImage: payload.avatarImage,
      };
      setMembers((prev) => [...prev, newMember]);
    }
    setSheet(null);
  }

  function handleEditMember(memberId: string) {
    const m = members.find((x) => x.id === memberId);
    if (m) setSheet({ mode: "edit", member: m });
  }

  function handleDeleteMember(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    if (selectedMemberId === memberId) setSelectedMemberId(null);
  }

  function onMonthShift(delta: number) {
    const { year, monthIndex } = shiftMonthYear(cursor.year, cursor.monthIndex, delta);
    setCursor({ year, monthIndex });
    setSelectedDateISO((prev) => normalizeSelectedDateInMonth(prev, year, monthIndex));
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function handleTaskSave(payload: NewTaskPayload, editingTaskId?: string) {
    const cat = payload.categoryId ? taskCategories.find((c) => c.id === payload.categoryId) : undefined;
    const dueISO = resolveDueISO(payload.dueKind, payload.dueDateISO);
    const notificationStored =
      payload.notification === "time" && payload.notificationTime
        ? `time:${payload.notificationTime}`
        : payload.notification;

    const shared = {
      title: payload.title.trim(),
      assignee: "—",
      assigneeMemberId: null,
      categoryId: cat?.id,
      categoryName: cat?.name,
      categoryColor: cat?.color,
      dueDateISO: dueISO,
      memo: payload.memo.trim() || undefined,
      repeat: payload.repeat,
      priority: payload.priority,
      notification: notificationStored,
    };

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTaskId ? { ...t, ...shared } : t)),
      );
    } else {
      const newTask: TaskItem = {
        id: `task-${Date.now()}`,
        ...shared,
        done: false,
      };
      setTasks((prev) => [...prev, newTask]);
    }
    setTaskModal(null);
  }

  function handleTaskDelete(taskId: string) {
    if (!window.confirm("このタスクを削除しますか？")) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setTaskModal(null);
  }

  const upsertMoodEntry = useCallback((entry: MoodEntry) => {
    setMoodEntries((prev) => {
      const idx = prev.findIndex((e) => e.dateISO === entry.dateISO);
      if (idx === -1) return [...prev, entry];
      const next = [...prev];
      next[idx] = entry;
      return next;
    });
  }, []);

  return (
    <AppShell
      tab={tab}
      onTabChange={setTab}
      header={
        <AppTabHeader
          key={tab}
          title={
            tab === "calendar" ? "カレンダー" : tab === "tasks" ? "タスク" : "気持ちログ"
          }
          members={members}
          selectedMemberId={selectedMemberId}
          showAddSchedule={tab === "calendar"}
          onAddSchedule={() => setScheduleSheet({ mode: "add" })}
          onAddMember={() => setSheet({ mode: "add" })}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
        />
      }
      overlay={
        sheet ? (
          <AddMemberSheet
            editingMember={sheet.mode === "edit" ? sheet.member : undefined}
            defaultColorHex={
              sheet.mode === "edit" ? sheet.member.colorHex : nextPalette.colorHex
            }
            defaultAvatarBg={
              sheet.mode === "edit" ? sheet.member.avatarBg : nextPalette.avatarBg
            }
            onClose={() => setSheet(null)}
            onSave={handleSheetSave}
          />
        ) : scheduleSheet ? (
          <AddSchedulePane
            members={members}
            categories={categories}
            onAddCategory={handleAddCategory}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={handleDeleteCategory}
            onQuickAddCategory={handleQuickAddCategory}
            initialDateISO={selectedDateISO}
            initialMemberId={selectedMemberId}
            editingSchedule={
              scheduleSheet.mode === "edit" ? scheduleSheet.schedule : undefined
            }
            onClose={() => setScheduleSheet(null)}
            onSave={handleScheduleSave}
            onDelete={handleScheduleDelete}
          />
        ) : taskModal ? (
          <TaskCreateModal
            key={taskModal.mode === "edit" ? taskModal.task.id : "create"}
            categories={taskCategories}
            setCategories={setTaskCategories}
            editingTask={taskModal.mode === "edit" ? taskModal.task : null}
            onClose={() => setTaskModal(null)}
            onSave={handleTaskSave}
            onDelete={
              taskModal.mode === "edit"
                ? () => handleTaskDelete(taskModal.task.id)
                : undefined
            }
          />
        ) : null
      }
    >
      {tab === "calendar" ? (
        <CalendarScreen
          members={members}
          selectedMemberId={selectedMemberId}
          onMemberChange={setSelectedMemberId}
          calendarView={calendarView}
          onCalendarViewChange={setCalendarView}
          cursorYear={cursor.year}
          cursorMonthIndex={cursor.monthIndex}
          onMonthShift={onMonthShift}
          selectedDateISO={selectedDateISO}
          onSelectDateISO={setSelectedDateISO}
          schedules={schedules}
          categories={categories}
          onScheduleClick={handleScheduleClick}
          onAddMember={() => setSheet({ mode: "add" })}
        />
      ) : null}

      {tab === "tasks" ? (
        <TaskScreen
          filter={taskScope}
          onFilter={setTaskScope}
          tasks={tasks}
          onToggleTask={toggleTask}
          onAddTask={() => setTaskModal({ mode: "create" })}
          onEditTask={(task) => setTaskModal({ mode: "edit", task })}
        />
      ) : null}

      {tab === "mood" ? (
        <MoodCalendarScreen entries={moodEntries} onSaveEntry={upsertMoodEntry} />
      ) : null}
    </AppShell>
  );
}
