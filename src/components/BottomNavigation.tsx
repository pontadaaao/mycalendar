"use client";

import type { TabId } from "@/lib/mamalog";
import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3.5v3M16 3.5v3" />
    </svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function MoodIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 14.2c.7.9 1.8 1.5 3 1.5s2.3-.6 3-1.5" />
      <circle cx="9.3" cy="10.2" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="10.2" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

type Item = {
  id: TabId;
  label: string;
  Icon: (props: IconProps) => ReactElement;
};

const ITEMS: Item[] = [
  { id: "calendar", label: "カレンダー", Icon: CalendarIcon },
  { id: "tasks", label: "タスク", Icon: CheckIcon },
  { id: "mood", label: "気持ち", Icon: MoodIcon },
];

type BottomNavigationProps = {
  active: TabId;
  onChange: (id: TabId) => void;
};

export function BottomNavigation({ active, onChange }: BottomNavigationProps) {
  return (
    <nav className="border-t border-black/[0.05] bg-white/95 px-2 pb-3 pt-2 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="flex items-end justify-between">
        {ITEMS.map((item) => {
          const isOn = active === item.id;
          const NavIcon = item.Icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-current={isOn ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-semibold transition-colors ${
                isOn ? "text-mamalog-main" : "text-mamalog-muted"
              }`}
            >
              <NavIcon className="h-[22px] w-[22px]" />
              <span className="tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
