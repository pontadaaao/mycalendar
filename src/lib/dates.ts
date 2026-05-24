import { toISODate } from "./mamalog";

export function parseISOLocal(dateISO: string): Date {
  const [y, m, d] = dateISO.split("-").map((n) => Number(n));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

export function shiftMonthYear(
  year: number,
  monthIndex: number,
  delta: number,
): { year: number; monthIndex: number } {
  const d = new Date(year, monthIndex + delta, 1);
  return { year: d.getFullYear(), monthIndex: d.getMonth() };
}

export function monthMatrix(year: number, monthIndex: number): (Date | null)[] {
  const first = new Date(year, monthIndex, 1);
  const jsDay = first.getDay();
  const startPad = jsDay;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, monthIndex, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** 日曜開始の週：選択日が含まれる7日間 */
export function weekRangeSundayContaining(dateISO: string): Date[] {
  const d = parseISOLocal(dateISO);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(start);
    x.setDate(start.getDate() + i);
    return x;
  });
}

export function isoFromDate(d: Date): string {
  return toISODate(d);
}

/** YYYY-MM-DD をローカル日付で delta 日ずらす */
export function addDaysToISO(dateISO: string, delta: number): string {
  const d = parseISOLocal(dateISO);
  d.setDate(d.getDate() + delta);
  return isoFromDate(d);
}

export function isSameISODate(a: string, b: string): boolean {
  return a === b;
}

export function weekdaysJa(): string[] {
  return ["日", "月", "火", "水", "木", "金", "土"];
}

/** 選択日が別月なら、その月の1日に寄せる */
export function normalizeSelectedDateInMonth(
  selectedISO: string,
  year: number,
  monthIndex: number,
): string {
  const d = parseISOLocal(selectedISO);
  if (d.getFullYear() !== year || d.getMonth() !== monthIndex) {
    return isoFromDate(new Date(year, monthIndex, 1));
  }
  return selectedISO;
}
