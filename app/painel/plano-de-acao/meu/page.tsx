import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { WeekPicker } from "@/components/action-plan/WeekPicker";
import { PlanStatusBadge } from "@/components/action-plan/PlanStatusBadge";
import { WeeklyActionTable } from "@/components/action-plan/WeeklyActionTable";
import { GoalsPanel } from "@/components/action-plan/GoalsPanel";
import { SubmitPlanButton } from "@/components/action-plan/SubmitPlanButton";
import { ShareButtons } from "@/components/action-plan/ShareButtons";
import type { SerializedItem } from "@/components/action-plan/WeeklyActionTable";
import type { SerializedGoal } from "@/components/action-plan/GoalsPanel";

export const metadata = { title: "Plano de Ação | Painel" };

// Parse YYYY-MM-DD → UTC midnight Date
function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

// Returns the Monday of the current week in YYYY-MM-DD
function getMondayIso(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon…
  const daysBack = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(monday.getDate() - daysBack);
  return monday.toISOString().split("T")[0];
}

function addDays(iso: string, n: number): string {
  const date = parseDate(iso);
  date.setUTCDate(date.getUTCDate() + n);
  return date.toISOString().split("T")[0];
}

function fmtMonth(iso: string): string {
  const [y, m] = iso.split("-");
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${months[Number(m) - 1]} ${y}`;
}

export default async function MeuPlanoPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    select: { id: true, company_id: true },
  });
  if (!profile) redirect("/painel");

  const params = await searchParams;
  const weekStart = params.week ?? getMondayIso();
  const weekEnd = addDays(weekStart, 6);
  const weekStartDate = parseDate(weekStart);

  const plan = await db.actionPlan.findUnique({
    where: { seller_id_week_start: { seller_id: profile.id, week_start: weekStartDate } },
    include: {
      items: { orderBy: { sort_order: "asc" } },
      goals: { orderBy: { sort_order: "asc" } },
    },
  });

  const now = new Date();
  const activeLink = plan
    ? await db.shareLink.findFirst({
        where: {
          plan_id: plan.id,
          revoked: false,
          OR: [{ expires_at: null }, { expires_at: { gt: now } }],
        },
        select: { id: true, token: true },
      })
    : null;

  const items: SerializedItem[] = (plan?.items ?? []).map((i) => ({
    id: i.id,
    category: i.category,
    action_text: i.action_text,
    desired_result: i.desired_result,
    actual_result: i.actual_result,
    status: i.status,
    sort_order: i.sort_order,
  }));

  const goals: SerializedGoal[] = (plan?.goals ?? []).map((g) => ({
    id: g.id,
    label: g.label,
    target_value: g.target_value,
    actual_value: g.actual_value,
    sort_order: g.sort_order,
  }));

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-800">Plano de Ação</h1>
            {plan && <PlanStatusBadge status={plan.status} />}
          </div>
          <ShareButtons weekStart={weekStart} initialLink={activeLink} />
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{fmtMonth(weekStart)}</p>
        <div className="mt-2">
          <WeekPicker weekStart={weekStart} weekEnd={weekEnd} />
        </div>
      </div>

      {/* Itens de ação */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Itens de Ação</h2>
        <WeeklyActionTable items={items} weekStart={weekStart} />
      </section>

      <div className="border-t border-gray-100" />

      {/* Metas */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Metas da Semana</h2>
        <GoalsPanel goals={goals} weekStart={weekStart} />
      </section>

      {/* Enviar semana */}
      {plan && (
        <>
          <div className="border-t border-gray-100" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              Ao enviar, o orientador pode ver esta semana como fechada para revisão.
            </p>
            <SubmitPlanButton planId={plan.id} status={plan.status} />
          </div>
        </>
      )}
    </div>
  );
}
