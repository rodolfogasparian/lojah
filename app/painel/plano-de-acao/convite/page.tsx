import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MentorInviteCard } from "@/components/action-plan/MentorInviteCard";
import { RemoveMentorshipButton } from "@/components/action-plan/RemoveMentorshipButton";

export const metadata = { title: "Convite de Orientação | Painel" };

export default async function ConvitePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    select: { id: true, slug: true, name: true },
  });
  if (!profile) redirect("/painel");

  const myMentors = await db.mentorship.findMany({
    where: { mentee_id: profile.id, status: "ACTIVE" },
    include: { mentor: { select: { id: true, name: true, slug: true } } },
    orderBy: { created_at: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-gray-800">Convite de Orientação</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Compartilhe este link com quem você quer acompanhar como orientador(a).
        </p>
      </div>

      <MentorInviteCard slug={profile.slug} />

      {/* Meus orientadores */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-bold text-gray-700">Meus orientadores</h2>
        {myMentors.length === 0 ? (
          <p className="text-sm text-slate-500">
            Você ainda não tem nenhum orientador vinculado. Peça o link de convite para quem vai te acompanhar.
          </p>
        ) : (
          <div className="space-y-2">
            {myMentors.map((ms) => (
              <div
                key={ms.id}
                className="flex items-center justify-between gap-3 border border-slate-200 rounded-lg bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{ms.mentor.name}</p>
                  <p className="text-xs text-slate-500">@{ms.mentor.slug}</p>
                </div>
                <RemoveMentorshipButton mentorshipId={ms.id} label="Encerrar" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
