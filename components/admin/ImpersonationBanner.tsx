"use client";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

type Props = {
  sellerName: string;
  adminReturnUrl: string;
  token: string;
};

export function ImpersonationBanner({ sellerName, adminReturnUrl }: Props) {
  const router = useRouter();

  async function handleExit() {
    await fetch("/api/admin/impersonate/exit", { method: "POST" });
    router.push(adminReturnUrl);
  }

  return (
    <div className="w-full bg-amber-500 text-white px-4 py-2 flex items-center justify-between z-50">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <AlertTriangle className="size-4" />
        Você está acessando como: {sellerName}
      </div>
      <button
        onClick={handleExit}
        className="text-xs bg-white text-amber-700 font-bold px-3 py-1 rounded-lg hover:bg-amber-50 transition-colors"
      >
        ← Voltar ao admin
      </button>
    </div>
  );
}
