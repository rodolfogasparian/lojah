"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle2 } from "lucide-react";
import type { ActionPlanStatus } from "@prisma/client";
import { submitPlan } from "@/app/painel/plano-de-acao/actions";

type Props = {
  planId: string;
  status: ActionPlanStatus;
};

export function SubmitPlanButton({ planId, status: initialStatus }: Props) {
  const [status, setStatus] = useState<ActionPlanStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (status === "SUBMITTED") {
    return (
      <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
        <CheckCircle2 className="size-4" />
        Semana enviada ao orientador
      </div>
    );
  }

  function handleSubmit() {
    startTransition(async () => {
      await submitPlan(planId);
      setStatus("SUBMITTED");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isPending}
      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
    >
      <Send className="size-4" />
      {isPending ? "Enviando..." : "Enviar semana"}
    </button>
  );
}
