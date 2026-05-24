"use client";

import type { TabId } from "@/lib/mamalog";
import { BottomNavigation } from "./BottomNavigation";
import type { ReactNode } from "react";

type AppShellProps = {
  tab: TabId;
  onTabChange: (t: TabId) => void;
  /** 画面上部に固定するヘッダー（タイトル・メニューなど）。スクロールしない */
  header?: ReactNode;
  children: ReactNode;
  /** iPhoneフレーム内で絶対配置されるオーバーレイ。モーダル／シート用 */
  overlay?: ReactNode;
};

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 pb-1 text-[13px] font-semibold tracking-tight text-mamalog-text">
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
          <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="currentColor" />
          <rect x="3.8" y="5" width="2.5" height="5" rx="0.5" fill="currentColor" />
          <rect x="7.6" y="3" width="2.5" height="7" rx="0.5" fill="currentColor" />
          <rect x="11.4" y="0.5" width="2.5" height="9.5" rx="0.5" fill="currentColor" />
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden>
          <path
            d="M7.5 9.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm0-3.1a4 4 0 0 1 2.85 1.18l1.06-1.06A5.5 5.5 0 0 0 7.5 4.6a5.5 5.5 0 0 0-3.91 1.62L4.66 7.28A4 4 0 0 1 7.5 6.1Zm0-3.1a7.1 7.1 0 0 1 5.05 2.09l1.06-1.06A8.6 8.6 0 0 0 7.5 1.5 8.6 8.6 0 0 0 1.39 4.03l1.06 1.06A7.1 7.1 0 0 1 7.5 3Z"
            fill="currentColor"
          />
        </svg>
        {/* battery */}
        <svg width="26" height="11" viewBox="0 0 26 11" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="22" height="10" rx="2.5" stroke="currentColor" opacity="0.45" />
          <rect x="2" y="2" width="19" height="7" rx="1.5" fill="currentColor" />
          <rect x="23.5" y="3.5" width="1.8" height="4" rx="0.6" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

export function AppShell({ tab, onTabChange, header, children, overlay }: AppShellProps) {
  return (
    <div className="flex min-h-dvh justify-center bg-white px-3 py-5 sm:py-10">
      <div
        className="relative flex w-full max-w-[390px] flex-col overflow-hidden rounded-[40px] border border-black/[0.06] bg-white shadow-[0_30px_80px_-20px_rgba(58,42,42,0.18)]"
        style={{ minHeight: "640px", maxHeight: "min(852px, 100dvh - 24px)" }}
      >
        <StatusBar />
        <main className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden">
          {header ? (
            <div className="relative z-30 shrink-0 border-b border-black/[0.06] bg-white px-5 pb-3 pt-4">
              {header}
            </div>
          ) : null}
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-white px-5 pb-28 pt-0">
            {children}
          </div>
        </main>
        <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-[45]">
          <BottomNavigation active={tab} onChange={onTabChange} />
        </div>
        {overlay}
      </div>
    </div>
  );
}
