import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PlanStatusBadge } from "@/components/action-plan/PlanStatusBadge";
import { RemoveMentorshipButton } from "@/components/action-plan/RemoveMentorshipButton";

export const metadata = { title: "Orientados | Plano de Ação" };

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default async function OrientadosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    select: { id: true },
  });
  if (!profile) redirect("/painel");

  const mentorships = await db.mentorship.findMany({
    where: { mentor_id: profile.id, status: "ACTIVE" },
    include: {
      mentee: {
        select: {
          id: true,
          name: true,
          slug: true,
          action_plans: {
            orderBy: { week_start: "desc" },
            take: 1,
            select: { id: true, status: true, week_start: true, week_end: true },
          },
        },
      },
    },
    orderBy: { created_at: "asc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-800">Orientados</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {mentorships.length === 0
            ? "Nenhum orientado ainda — compartilhe seu link de convite."
            : `${mentorships.length} orientado${mentorships.length !== 1 ? "s" : ""} vinculado${mentorships.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        {mentorships.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <p className="text-sm text-slate-500">
              Compartilhe seu link de convite para começar a acompanhar orientados.
            </p>
            <Link
              href="/painel/plano-de-acao/convite"
              className="inline-block text-sm text-primary font-semibold hover:underline"
            >
              Ir para Convite →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {mentorships.map((ms) => {
              const lastPlan = ms.mentee.action_plans[0];
              const weekStr = lastPlan
                ? `${fmtDate(lastPlan.week_start.toISOString().split("T")[0])} – ${fmtDate(lastPlan.week_end.toISOString().split("T")[0])}`
                : null;

              return (
                <div
                  key={ms.id}
                  className="border border-slate-200 rounded-xl bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{ms.mentee.name}</p>
                      <p className="text-xs text-slate-500">@{ms.mentee.slug}</p>
                      {lastPlan ? (
                        <div className="flex items-center gap-2 mt-1.5">
                          <PlanStatusBadge status={lastPlan.status} />
                          {weekStr && (
                            <span className="text-[10px] text-slate-500">{weekStr}</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 mt-1">Sem plano registrado ainda</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Link
                        href={`/painel/plano-de-acao/orientados/${ms.mentee.id}`}
                        className="text-xs bg-primary text-primary-foreground font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Ver plano
                      </Link>
                      <RemoveMentorshipButton mentorshipId={ms.id} label="Encerrar" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
