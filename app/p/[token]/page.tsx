import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PlanStatusBadge } from "@/components/action-plan/PlanStatusBadge";
import { WeeklyActionTable } from "@/components/action-plan/WeeklyActionTable";
import { GoalsPanel } from "@/components/action-plan/GoalsPanel";
import type { SerializedItem } from "@/components/action-plan/WeeklyActionTable";
import type { SerializedGoal } from "@/components/action-plan/GoalsPanel";

function fmtBR(isoDate: string): string {
  const [, m, d] = isoDate.split("-");
  return `${d}/${m}`;
}

function fmtMonth(iso: string): string {
  const [y, m] = iso.split("-");
  const months = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
  ];
  return `${months[Number(m) - 1]} ${y}`;
}

export default async function SharePlanPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const shareLink = await db.shareLink.findUnique({
    where: { token },
    include: {
      plan: {
        include: {
          items: { orderBy: { sort_order: "asc" } },
          goals: { orderBy: { sort_order: "asc" } },
          seller: { select: { name: true } },
        },
      },
    },
  });

  const now = new Date();
  if (
    !shareLink ||
    shareLink.revoked ||
    (shareLink.expires_at !== null && shareLink.expires_at <= now)
  ) {
    notFound();
  }

  const { plan } = shareLink;
  const weekStartIso = plan.week_start.toISOString().split("T")[0];
  const weekEndIso = plan.week_end.toISOString().split("T")[0];

  const items: SerializedItem[] = plan.items.map((i) => ({
    id: i.id,
    category: i.category,
    action_text: i.action_text,
    desired_result: i.desired_result,
    actual_result: i.actual_result,
    status: i.status,
    sort_order: i.sort_order,
  }));

  const goals: SerializedGoal[] = plan.goals.map((g) => ({
    id: g.id,
    label: g.label,
    target_value: g.target_value,
    actual_value: g.actual_value,
    sort_order: g.sort_order,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                Plano de Ação
              </p>
              <h1 className="text-base font-bold text-gray-800">
                {plan.seller.name}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {fmtBR(weekStartIso)} – {fmtBR(weekEndIso)} · {fmtMonth(weekStartIso)}
              </p>
            </div>
            <PlanStatusBadge status={plan.status} />
          </div>
        </div>

        {/* Itens de ação */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-700 px-1">Itens de Ação</h2>
          <WeeklyActionTable items={items} weekStart={weekStartIso} readOnly />
        </section>

        {/* Metas */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-700 px-1">Metas da Semana</h2>
          <GoalsPanel goals={goals} weekStart={weekStartIso} readOnly />
        </section>

        <p className="text-center text-xs text-gray-300 pt-4">lojah.app</p>
      </div>
    </div>
  );
}
