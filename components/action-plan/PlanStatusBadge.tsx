import type { ActionPlanStatus } from "@prisma/client";

const CONFIG: Record<ActionPlanStatus, { label: string; cls: string }> = {
  DRAFT: { label: "Rascunho", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  SUBMITTED: { label: "Enviado", cls: "bg-green-50 text-green-700 border-green-200" },
};

export function PlanStatusBadge({ status }: { status: ActionPlanStatus }) {
  const { label, cls } = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      {status === "SUBMITTED" && (
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
      )}
      {label}
    </span>
  );
}
