/** プロトタイプでは「今日」とカレンダー初期表示をこれに固定（デモデータと整合） */
export const PROTOTYPE_ANCHOR_DATE = new Date(2026, 4, 2); /* 2026-05-02 土曜 */

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const PROTOTYPE_ANCHOR_ISO = toISODate(PROTOTYPE_ANCHOR_DATE);

export type TabId = "calendar" | "tasks" | "mood";

export type CalendarGranularity = "all" | "day" | "week" | "month";

export type Member = {
  id: string;
  name: string;
  /** Tailwind mamalog-* class segment */
  colorToken: string;
  colorHex: string;
  /** カラフルな丸の中に入れる絵文字。アバター用の手っ取り早い装飾 */
  avatar: string;
  /** アバター丸の薄い背景色（colorHex の淡色版） */
  avatarBg: string;
  /** ユーザーがアップロードした写真（data URL）。あれば絵文字より優先 */
  avatarImage?: string;
};

export const MEMBERS: Member[] = [
  { id: "mama", name: "ママ", colorToken: "mamalog-main", colorHex: "#FF7F91", avatar: "👩", avatarBg: "#FFE0E6" },
  { id: "yuta", name: "ゆうと", colorToken: "mamalog-blue", colorHex: "#8EB8FF", avatar: "🧒", avatarBg: "#E1ECFF" },
  { id: "papa", name: "パパ", colorToken: "mamalog-green", colorHex: "#9BD6A3", avatar: "👨", avatarBg: "#E2F3E5" },
  { id: "baaba", name: "ばあば", colorToken: "mamalog-purple", colorHex: "#B7A3E8", avatar: "👵", avatarBg: "#EBE2F8" },
  { id: "jii", name: "じいじ", colorToken: "mamalog-orange", colorHex: "#F5B36B", avatar: "👴", avatarBg: "#FCE8D2" },
  { id: "sensei", name: "先生", colorToken: "mamalog-yellow", colorHex: "#F6D365", avatar: "👩‍🏫", avatarBg: "#FCF1CF" },
];

export const MAX_MEMBER_COUNT = 10;

export type MemberColor = {
  /** 表示用カラー */
  colorHex: string;
  /** アバター丸の薄い背景色 */
  avatarBg: string;
  /** アクセシビリティ用ラベル */
  label: string;
};

/**
 * メンバー追加 / 編集モーダルでユーザーが選べるカラーパレット。
 * 1〜6 行目は既存6名のデフォルトカラー、7〜12 行目は追加メンバー向けの拡張色。
 */
export const MEMBER_COLOR_PALETTE: MemberColor[] = [
  { colorHex: "#FF7F91", avatarBg: "#FFE0E6", label: "ピンク" },
  { colorHex: "#8EB8FF", avatarBg: "#E1ECFF", label: "ブルー" },
  { colorHex: "#9BD6A3", avatarBg: "#E2F3E5", label: "グリーン" },
  { colorHex: "#B7A3E8", avatarBg: "#EBE2F8", label: "パープル" },
  { colorHex: "#F5B36B", avatarBg: "#FCE8D2", label: "オレンジ" },
  { colorHex: "#F6D365", avatarBg: "#FCF1CF", label: "イエロー" },
  { colorHex: "#5DC4D9", avatarBg: "#D9EFF4", label: "ティール" },
  { colorHex: "#E89A8B", avatarBg: "#F8E2DD", label: "コーラル" },
  { colorHex: "#A8C66C", avatarBg: "#E8EFD3", label: "ライム" },
  { colorHex: "#E47BB6", avatarBg: "#F8DDEC", label: "マゼンタ" },
  { colorHex: "#7BB3F2", avatarBg: "#DEEBFB", label: "スカイ" },
  { colorHex: "#C49AE8", avatarBg: "#EBDDF8", label: "ラベンダー" },
];

/**
 * 新規追加時のデフォルト色を提案するための簡易ローテーション。
 * 既存メンバー色（最初の6色）とぶつかりにくいよう拡張色から取る。
 */
export const NEW_MEMBER_PALETTE: { colorHex: string; avatarBg: string }[] =
  MEMBER_COLOR_PALETTE.slice(6).map(({ colorHex, avatarBg }) => ({ colorHex, avatarBg }));

export type ScheduleCategory = {
  id: string;
  name: string;
  /** タグやサイドバーに使う表示色 */
  color: string;
  /** 淡い背景色（バッジの bg などに使う） */
  bg: string;
};

/** 予定のカテゴリ（カラー付き） */
export const SCHEDULE_CATEGORIES: ScheduleCategory[] = [
  { id: "childcare", name: "育児",     color: "#FF7F91", bg: "#FFE0E6" },
  { id: "medical",   name: "病院",     color: "#8EB8FF", bg: "#E1ECFF" },
  { id: "family",    name: "家族",     color: "#B7A3E8", bg: "#EBE2F8" },
  { id: "work",      name: "仕事",     color: "#9BD6A3", bg: "#E2F3E5" },
  { id: "lesson",    name: "習い事",   color: "#F5B36B", bg: "#FCE8D2" },
  { id: "event",     name: "イベント", color: "#F6D365", bg: "#FCF1CF" },
  { id: "other",     name: "その他",   color: "#9A8A8A", bg: "#EFE7E5" },
];

/** カテゴリ未指定 / 未登録 ID 用のフォールバック */
export const FALLBACK_CATEGORY: ScheduleCategory =
  SCHEDULE_CATEGORIES[SCHEDULE_CATEGORIES.length - 1];

/**
 * 動的カテゴリリストから id で1件引く。見つからなければフォールバック。
 * 旧 `categoryOf` のリプレース。
 */
export function findCategory(
  categories: ScheduleCategory[],
  id: string | undefined,
): ScheduleCategory {
  return categories.find((c) => c.id === id) ?? FALLBACK_CATEGORY;
}

export type ScheduleItem = {
  id: string;
  /** 開始日 YYYY-MM-DD */
  dateISO: string;
  /** 開始時刻 HH:MM（allDay のときは未使用） */
  time: string;
  /** 終了日 YYYY-MM-DD（省略時は開始日と同日扱い） */
  endDateISO?: string;
  /** 終了時刻 HH:MM（省略時は表示しない） */
  endTime?: string;
  /** 終日予定 */
  allDay?: boolean;
  /** カテゴリ id */
  categoryId?: string;
  title: string;
  location: string;
  /** メモ（自由記述・複数行可） */
  memo?: string;
  memberId: string;
};

/** ユーザー指定の5月2日（2026年）のサンプル */
export const SAMPLE_SCHEDULES: ScheduleItem[] = [
  {
    id: "s1",
    dateISO: "2026-05-02",
    time: "10:00",
    endTime: "11:00",
    title: "ゆうとの予防接種",
    location: "小児科",
    memo: "母子手帳とおむつ持参",
    memberId: "yuta",
    categoryId: "medical",
  },
  {
    id: "s2",
    dateISO: "2026-05-02",
    time: "15:00",
    endTime: "16:30",
    title: "ママ：美容院",
    location: "表参道",
    memberId: "mama",
    categoryId: "family",
  },
  {
    id: "s3",
    dateISO: "2026-05-02",
    time: "18:30",
    endTime: "21:00",
    title: "パパ：飲み会",
    location: "居酒屋",
    memo: "終電に注意",
    memberId: "papa",
    categoryId: "event",
  },
];

export type TaskItem = {
  id: string;
  title: string;
  assignee: string;
  /** 設定されていれば一覧でカレンダーと同じアイコン表示 */
  assigneeMemberId?: string | null;
  done: boolean;
  /** タスク作成フォームから保存された任意フィールド */
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
  dueDateISO?: string | null;
  memo?: string;
  repeat?: string;
  priority?: string;
  notification?: string;
};

export const INITIAL_TASKS: TaskItem[] = [
  { id: "t1", title: "ミルク準備", assignee: "ママ", assigneeMemberId: "mama", done: false },
  { id: "t2", title: "ゴミ出し", assignee: "パパ", assigneeMemberId: "papa", done: true },
  { id: "t3", title: "お風呂に入れる", assignee: "ママ", assigneeMemberId: "mama", done: false },
  { id: "t4", title: "買い物に行く", assignee: "パパ", assigneeMemberId: "papa", done: false },
  { id: "t5", title: "絵本を読む", assignee: "ママ", assigneeMemberId: "mama", done: false },
];

/* -------------------------------------------------- *
 * 気持ちカレンダー用：日次で記録される気分の正式定義
 * -------------------------------------------------- */

export type MoodId = "happy" | "normal" | "sad" | "angry" | "tired";

export type MoodKind = {
  id: MoodId;
  label: string;
  emoji: string;
  /** 指定時は絵文字の代わりに画像を表示（フォールバック・アクセシビリティ用に emoji は維持） */
  iconSrc?: string;
  /** メインカラー（選択中のフィルやアクセント用） */
  color: string;
  /** カレンダーセルなどの淡い背景色 */
  bgColor: string;
  /** 上記bg上で読みやすい濃いめ文字色 */
  textColor: string;
};

export const MOOD_KINDS: MoodKind[] = [
  {
    id: "happy",
    label: "うれしい",
    emoji: "😆",
    iconSrc: "/moods/happy.png",
    color: "#F6D365",
    bgColor: "#FCF1CF",
    textColor: "#A57708",
  },
  {
    id: "normal",
    label: "ふつう",
    emoji: "🙂",
    iconSrc: "/moods/normal.png",
    color: "#9BD6A3",
    bgColor: "#E2F3E5",
    textColor: "#3F7C4D",
  },
  {
    id: "sad",
    label: "しんどい",
    emoji: "😢",
    iconSrc: "/moods/sad.png",
    color: "#8EB8FF",
    bgColor: "#E1ECFF",
    textColor: "#3D6BBD",
  },
  {
    id: "angry",
    label: "イライラ",
    emoji: "😡",
    iconSrc: "/moods/angry.png",
    color: "#F08A8A",
    bgColor: "#FBE0E0",
    textColor: "#B45252",
  },
  {
    id: "tired",
    label: "つかれた",
    emoji: "😴",
    iconSrc: "/moods/tired.png",
    color: "#B7A3E8",
    bgColor: "#EBE2F8",
    textColor: "#604AA1",
  },
];

export type MoodEntry = {
  dateISO: string;
  moodId: MoodId;
  memo: string;
};

/** 今月のサンプル気持ちログ（プロトタイプ表示用） */
export const SAMPLE_MOOD_ENTRIES: MoodEntry[] = [
  { dateISO: "2026-05-01", moodId: "happy",  memo: "友達とご飯に行けて楽しかった" },
  { dateISO: "2026-05-02", moodId: "sad",    memo: "仕事で疲れた" },
  { dateISO: "2026-05-03", moodId: "normal", memo: "のんびりできた" },
  { dateISO: "2026-05-04", moodId: "angry",  memo: "予定が詰まりすぎてイライラした" },
  { dateISO: "2026-05-05", moodId: "tired",  memo: "眠すぎる一日だった" },
];

