"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { MEMBER_COLOR_PALETTE, type Member, type MemberColor } from "@/lib/mamalog";

/** アップロード以外で選ぶプリセットアイコン（public/member-avatars/*.png）。3・4番は並びを入れ替え */
const PRESET_AVATAR_IDS = [
  "01",
  "02",
  "04",
  "03",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
] as const;

const PRESET_AVATARS = PRESET_AVATAR_IDS.map((id) => `/member-avatars/${id}.png`);

/** 写真・プリセットが無いときのフォールバック絵文字（保存時の avatar 文字列） */
const FALLBACK_AVATAR_EMOJI = "👤";

export type AddMemberPayload = {
  name: string;
  /** 絵文字（写真がない場合のフォールバック） */
  avatar: string;
  /** アップロード写真の data URL */
  avatarImage?: string;
  /** ユーザーが選択したカラー */
  colorHex: string;
  avatarBg: string;
};

type AddMemberSheetProps = {
  /** 編集モードのときに渡す既存メンバー。undefined なら新規追加モード */
  editingMember?: Member;
  /** 新規追加時のデフォルト色（パレット内のいずれか） */
  defaultColorHex: string;
  defaultAvatarBg: string;
  onClose: () => void;
  onSave: (payload: AddMemberPayload) => void;
};

/** 与えられた hex に最も近いパレット項目を返す（厳密一致 → 先頭フォールバック） */
function resolveInitialColor(hex: string): MemberColor {
  return MEMBER_COLOR_PALETTE.find((c) => c.colorHex === hex) ?? MEMBER_COLOR_PALETTE[0];
}

export function AddMemberSheet({
  editingMember,
  defaultColorHex,
  defaultAvatarBg,
  onClose,
  onSave,
}: AddMemberSheetProps) {
  const isEdit = !!editingMember;
  const [name, setName] = useState(editingMember?.name ?? "");
  const [photo, setPhoto] = useState<string | null>(() => {
    if (editingMember?.avatarImage) return editingMember.avatarImage;
    if (!editingMember) return PRESET_AVATARS[0];
    return null;
  });

  const initialColor = resolveInitialColor(editingMember?.colorHex ?? defaultColorHex);
  const [colorHex, setColorHex] = useState(initialColor.colorHex);
  const [avatarBg, setAvatarBg] = useState(
    editingMember?.avatarBg ?? (initialColor.colorHex === defaultColorHex ? defaultAvatarBg : initialColor.avatarBg),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  function pickColor(c: MemberColor) {
    setColorHex(c.colorHex);
    setAvatarBg(c.avatarBg);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function pickPresetAvatar(url: string) {
    setPhoto(url);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openCustomPhotoPicker() {
    fileInputRef.current?.click();
  }

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const avatarStored =
      !photo && editingMember?.avatar ? editingMember.avatar : FALLBACK_AVATAR_EMOJI;
    onSave({
      name: trimmed,
      avatar: avatarStored,
      avatarImage: photo ?? undefined,
      colorHex,
      avatarBg,
    });
  }

  const canSave = name.trim().length > 0;
  const title = isEdit ? "メンバーを編集" : "メンバーを追加";
  const cta = isEdit ? "変更を保存" : "このメンバーを追加";
  const customPhotoSelected = Boolean(photo?.startsWith("data:"));

  return (
    <div className="absolute inset-0 z-50 flex min-h-0 flex-col" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative mt-auto flex max-h-[88%] min-h-0 w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-12px_30px_rgba(0,0,0,0.18)]">
        <header className="relative flex flex-col border-b border-black/[0.05] px-4 pt-[21px] pb-[17px]">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-mamalog-muted/30" aria-hidden />
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-[13px] font-semibold text-mamalog-muted hover:text-mamalog-text"
            >
              キャンセル
            </button>
            <h1 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[15px] font-bold text-mamalog-text">
              {title}
            </h1>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="ml-auto text-[13px] font-bold text-mamalog-main disabled:opacity-40"
            >
              保存
            </button>
          </div>
        </header>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-6">
          {/* アバタープレビュー */}
          <div className="flex flex-col items-center gap-2">
            <span
              className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-4xl transition-[background-color,box-shadow] duration-200"
              style={{
                backgroundColor: photo ? "transparent" : avatarBg,
                boxShadow: `0 0 0 3px ${colorHex}33`,
              }}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="プレビュー" className="h-full w-full object-cover" />
              ) : (
                <span>{editingMember?.avatar ?? FALLBACK_AVATAR_EMOJI}</span>
              )}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold"
              style={{ backgroundColor: avatarBg, color: colorHex }}
            >
              {name.trim() || (isEdit ? editingMember?.name : "新しいメンバー")}
            </span>
          </div>

          {/* 名前 */}
          <div className="mt-5">
            <label htmlFor="memberName" className="text-[11px] font-bold text-mamalog-muted">
              名前
            </label>
            <input
              id="memberName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：たろう / おばあちゃん"
              maxLength={12}
              className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-mamalog-sub/30 px-3 py-2.5 text-[14px] font-semibold text-mamalog-text caret-mamalog-main outline-none transition focus:border-mamalog-main/50 focus:bg-white"
            />
          </div>

          {/* プリセット or オリジナル写真（名前の直下） */}
          <div className="mt-5">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <p className="shrink-0 text-[11px] font-bold text-mamalog-muted">アイコン</p>
              <p className="text-[10px] leading-snug text-mamalog-muted/85">
                プラスボタンで好きな写真にできます
              </p>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-x-1.5 gap-y-2">
              {PRESET_AVATARS.map((url, index) => {
                const on = photo === url;
                return (
                  <div key={url} className="flex justify-center">
                    <button
                      type="button"
                      aria-label={`アイコン ${index + 1}`}
                      aria-pressed={on}
                      onClick={() => pickPresetAvatar(url)}
                      className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full transition ${
                        on
                          ? "bg-mamalog-main/15 ring-2 ring-mamalog-main ring-offset-2 ring-offset-white"
                          : "bg-mamalog-sub/30 ring-1 ring-black/[0.06] hover:bg-mamalog-sub/60"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" draggable={false} />
                    </button>
                  </div>
                );
              })}
              <div className="flex justify-center">
                <button
                  type="button"
                  aria-label="オリジナルの写真を選ぶ"
                  aria-pressed={customPhotoSelected}
                  onClick={openCustomPhotoPicker}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed text-xl font-semibold transition ${
                    customPhotoSelected
                      ? "border-mamalog-main bg-mamalog-main/15 text-mamalog-main ring-2 ring-mamalog-main ring-offset-2 ring-offset-white"
                      : "border-mamalog-main/45 bg-mamalog-sub/30 text-mamalog-main hover:bg-mamalog-sub/55"
                  }`}
                >
                  ＋
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* カラーピッカー */}
          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-bold text-mamalog-muted">カラー</p>
              <p className="text-[10px] text-mamalog-muted/80">
                予定タグやドットの色になります
              </p>
            </div>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {MEMBER_COLOR_PALETTE.map((c) => {
                const on = c.colorHex === colorHex;
                return (
                  <button
                    key={c.colorHex}
                    type="button"
                    aria-label={`カラー：${c.label}`}
                    aria-pressed={on}
                    onClick={() => pickColor(c)}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full transition active:scale-95"
                    style={{
                      backgroundColor: c.colorHex,
                      boxShadow: on
                        ? `0 0 0 2px #ffffff, 0 0 0 4px ${c.colorHex}`
                        : "0 0 0 1px rgba(0,0,0,0.06)",
                    }}
                  >
                    {on ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="white"
                        strokeWidth={2.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M5 10.5l3 3 7-7" />
                      </svg>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <PrimaryButton
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="mt-6 w-full py-3 text-[14px]"
          >
            {cta}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
