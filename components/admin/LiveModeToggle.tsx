"use client";

import { Eye, EyeOff } from "lucide-react";
import { useLiveMode } from "@/hooks/useLiveMode";

export function LiveModeToggle() {
  const { live, toggle } = useLiveMode();

  return (
    <>
      {/* Injeta o CSS de blur apenas quando o modo live está ativo */}
      {live && (
        <style>{`
          .admin-sensitive {
            filter: blur(6px);
            transition: filter 0.25s ease;
          }
        `}</style>
      )}

      <button
        type="button"
        onClick={toggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
          live
            ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        {live ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        {live ? "Ocultar ativo" : "Modo Live"}
      </button>
    </>
  );
}
