"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeMentorship } from "@/app/painel/plano-de-acao/actions";

type Props = {
  mentorshipId: string;
  label?: string;
};

export function RemoveMentorshipButton({ mentorshipId, label = "Encerrar vínculo" }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      await removeMentorship(mentorshipId);
      router.refresh();
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Confirmar encerramento?</span>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={isPending}
        className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
      >
        {isPending ? "..." : "Sim, encerrar"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs text-gray-400 hover:underline"
      >
        Cancelar
      </button>
    </div>
  );
}
