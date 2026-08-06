import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { WeekPicker } from "@/components/action-plan/WeekPicker";
import { PlanStatusBadge } from "@/components/action-plan/PlanStatusBadge";
import { WeeklyActionTable } from "@/components/action-plan/WeeklyActionTable";
import { GoalsPanel } from "@/components/action-plan/GoalsPanel";
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

export default async function AdminSellerPlanoPage({
  params,
  searchParams,
}: {
  params: Promise<{ sellerId: string }>;
  searchParams: Promise<{ week?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { sellerId } = await params;

  const seller = await db.sellerProfile.findUnique({
    where: { id: sellerId },
    select: { id: true, name: true, slug: true, company_id: true },
  });

  if (!seller) notFound();

  // Permissão: SUPERADMIN sempre pode; COMPANY_ADMIN só da mesma empresa
  if (
    session.user.role !== "SUPERADMIN" &&
    (session.user.role !== "COMPANY_ADMIN" || session.user.companyId !== seller.company_id)
  ) {
    notFound();
  }

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
            href="/admin/plano-de-acao"
            className="text-xs text-slate-500 hover:text-gray-700 transition-colors"
          >
            ← Planos de Ação
          </Link>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{seller.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              @{seller.slug} · {fmtMonth(weekStart)} · somente leitura
            </p>
          </div>
          {plan && <PlanStatusBadge status={plan.status} />}
        </div>
        <div className="mt-3">
          <WeekPicker weekStart={weekStart} weekEnd={weekEnd} />
        </div>
      </div>

      {/* Itens de ação */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Itens de Ação</h2>
        <WeeklyActionTable items={items} weekStart={weekStart} readOnly />
      </section>

      <div className="border-t border-slate-200" />

      {/* Metas */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Metas da Semana</h2>
        <GoalsPanel goals={goals} weekStart={weekStart} readOnly />
      </section>
    </div>
  );
}
