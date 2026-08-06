"use client";

import { useTransition } from "react";
import { switchToAdmin, switchToSeller } from "@/app/actions/mode";

type Props = {
  currentMode: "admin" | "seller";
};

export function ModeSwitcher({ currentMode }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSwitch(target: "admin" | "seller") {
    if (target === currentMode || isPending) return;
    startTransition(async () => {
      if (target === "admin") await switchToAdmin();
      else await switchToSeller();
    });
  }

  return (
    <div
      className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs shrink-0"
      title="Alternar modo de visualização"
    >
      <button
        type="button"
        onClick={() => handleSwitch("admin")}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
          currentMode === "admin"
            ? "bg-white text-gray-800 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Admin
      </button>
      <button
        type="button"
        onClick={() => handleSwitch("seller")}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
          currentMode === "seller"
            ? "bg-white text-gray-800 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Vendedor
      </button>
    </div>
  );
}
