"use client";

import { useRouter } from "next/navigation";

type Props = {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;   // YYYY-MM-DD
};

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0];
}

function fmtBR(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export function WeekPicker({ weekStart, weekEnd }: Props) {
  const router = useRouter();

  function go(newStart: string) {
    router.push(`?week=${newStart}`);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => go(addDays(weekStart, -7))}
        className="h-7 w-7 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 text-base font-bold leading-none flex items-center justify-center transition-colors"
        title="Semana anterior"
      >
        ‹
      </button>
      <div className="flex items-center gap-1 text-sm">
        <input
          type="date"
          value={weekStart}
          onChange={(e) => e.target.value && go(e.target.value)}
          className="border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="text-gray-400 text-xs">→ {fmtBR(weekEnd)}</span>
      </div>
      <button
        type="button"
        onClick={() => go(addDays(weekStart, 7))}
        className="h-7 w-7 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 text-base font-bold leading-none flex items-center justify-center transition-colors"
        title="Próxima semana"
      >
        ›
      </button>
    </div>
  );
}
