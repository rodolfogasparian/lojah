import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PlanStatusBadge } from "@/components/action-plan/PlanStatusBadge";

export const metadata = { title: "Planos de Ação | Admin" };

function getMondayIso(): string {
  const now = new Date();
  const day = now.getDay();
  const daysBack = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(monday.getDate() - daysBack);
  return monday.toISOString().split("T")[0];
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fmtBR(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export default async function AdminPlanoDeAcaoPage() {
  const session = await auth();
  if (!session?.user?.companyId) redirect("/login");

  const companyId = session.user.companyId;
  const weekStart = getMondayIso();
  const weekStartDate = parseDate(weekStart);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 6);
  const weekEndIso = weekEndDate.toISOString().split("T")[0];

  const sellers = await db.sellerProfile.findMany({
    where: { company_id: companyId, active: true },
    include: {
      action_plans: {
        where: { week_start: weekStartDate },
        take: 1,
        select: { id: true, status: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const submitted = sellers.filter((s) => s.action_plans[0]?.status === "SUBMITTED").length;
  const draft = sellers.filter((s) => s.action_plans[0]?.status === "DRAFT").length;
  const none = sellers.length - submitted - draft;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Planos de Ação</h1>
        <p className="text-sm text-slate-500 mt-1">
          Semana {fmtBR(weekStart)} – {fmtBR(weekEndIso)} ·{" "}
          {submitted} enviado{submitted !== 1 ? "s" : ""},{" "}
          {draft} rascunho{draft !== 1 ? "s" : ""},{" "}
          {none} sem plano
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
        {sellers.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">Nenhum vendedor ativo cadastrado.</p>
        ) : (
          sellers.map((seller) => {
            const plan = seller.action_plans[0] ?? null;
            return (
              <div
                key={seller.id}
                className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{seller.name}</p>
                  <p className="text-xs text-slate-500">@{seller.slug}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {plan ? (
                    <PlanStatusBadge status={plan.status} />
                  ) : (
                    <span className="text-xs text-slate-500 italic">Sem plano</span>
                  )}
                  <Link
                    href={`/admin/plano-de-acao/${seller.id}`}
                    className="text-xs bg-primary text-primary-foreground font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Ver plano
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
