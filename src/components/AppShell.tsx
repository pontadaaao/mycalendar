"use client";

import type { TabId } from "@/lib/mamalog";
import { BottomNavigation } from "./BottomNavigation";
import type { CSSProperties, ReactNode } from "react";

type AppShellProps = {
  tab: TabId;
  onTabChange: (t: TabId) => void;
  /** 画面上部に固定するヘッダー（タイトル・メニューなど）。スクロールしない */
  header?: ReactNode;
  children: ReactNode;
  /** モーダル／シート用オーバーレイ（全画面） */
  overlay?: ReactNode;
};

/** 下部タブバー実高めのゆとり込みスクロール余白（label+icon+パディング想定） */
const SCROLL_PADDING_BOTTOM_NAV = "5.85rem";

export function AppShell({ tab, onTabChange, header, children, overlay }: AppShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-transparent">
      {header ? (
        <header
          className="shrink-0 px-4 pb-3 pt-[max(10px,env(safe-area-inset-top))]"
          role="presentation"
        >
          {header}
        </header>
      ) : (
        <div
          className="shrink-0 pt-[max(12px,env(safe-area-inset-top))]"
          aria-hidden
        />
      )}

      <div
        className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pb-[calc(var(--scroll-nav-pad)+env(safe-area-inset-bottom))] pl-4 pr-4 pt-0.5"
        style={
          {
            "--scroll-nav-pad": SCROLL_PADDING_BOTTOM_NAV,
          } as CSSProperties
        }
      >
        {children}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[45]">
        <BottomNavigation active={tab} onChange={onTabChange} />
      </div>

      {overlay}
    </div>
  );
}
