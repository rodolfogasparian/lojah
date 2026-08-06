import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { WeekPicker } from "@/components/action-plan/WeekPicker";
import { PlanStatusBadge } from "@/components/action-plan/PlanStatusBadge";
import { WeeklyActionTable } from "@/components/action-plan/WeeklyActionTable";
import { GoalsPanel } from "@/components/action-plan/GoalsPanel";
import { RemoveMentorshipButton } from "@/components/action-plan/RemoveMentorshipButton";
import type { SerializedItem } from "@/components/action-plan/WeeklyActionTable";
import type { SerializedGoal } from "@/components/action-plan/GoalsPanel";

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function getMondayIso(): string {
  const now = new Date();
  const day = now.getDay();
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

export default async function OrientadoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ sellerId: string }>;
  searchParams: Promise<{ week?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const mentor = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    select: { id: true },
  });
  if (!mentor) redirect("/painel");

  const { sellerId } = await params;

  // Valida vínculo ACTIVE
  const mentorship = await db.mentorship.findUnique({
    where: { mentor_id_mentee_id: { mentor_id: mentor.id, mentee_id: sellerId } },
    include: { mentee: { select: { id: true, name: true, slug: true } } },
  });

  if (!mentorship || mentorship.status !== "ACTIVE") notFound();

  const sp = await searchParams;
  const weekStart = sp.week ?? getMondayIso();
  const weekEnd = addDays(weekStart, 6);
  const weekStartDate = parseDate(weekStart);

  const plan = await db.actionPlan.findUnique({
    where: { seller_id_week_start: { seller_id: sellerId, week_start: weekStartDate } },
    include: {
      items: { orderBy: { sort_order: "asc" } },
      goals: { orderBy: { sort_order: "asc" } },
    },
  });

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
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/painel/plano-de-acao/orientados"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Orientados
          </Link>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{mentorship.mentee.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {fmtMonth(weekStart)} · somente leitura
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {plan && <PlanStatusBadge status={plan.status} />}
            <RemoveMentorshipButton
              mentorshipId={mentorship.id}
              label="Encerrar vínculo"
            />
          </div>
        </div>
        <div className="mt-3">
          <WeekPicker weekStart={weekStart} weekEnd={weekEnd} />
        </div>
      </div>

      {/* Itens de ação (readOnly) */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Itens de Ação</h2>
        <WeeklyActionTable items={items} weekStart={weekStart} readOnly />
      </section>

      <div className="border-t border-gray-100" />

      {/* Metas (readOnly) */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Metas da Semana</h2>
        <GoalsPanel goals={goals} weekStart={weekStart} readOnly />
      </section>
    </div>
  );
}
