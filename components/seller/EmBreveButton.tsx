"use client";

export function EmBreveButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => alert("Em breve")}
      className="w-full py-3 px-5 rounded-lg font-semibold text-sm text-[#1a1a1a] text-center transition-opacity hover:opacity-80"
      style={{ backgroundColor: "#cfee9a" }}
    >
      {label}
    </button>
  );
}
