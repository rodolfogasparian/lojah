// Página exclusiva de vendedor (SELLER).
// COMPANY_ADMIN não tem seller_profile — não acessa estes dados.
// A visão do admin (todos os leads da empresa) é entrega futura separada.

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { KanbanLeads } from "./KanbanLeads";
import type { LeadRow } from "./KanbanLeads";

export const metadata = { title: "Meus Leads | Painel" };

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Recupera o seller_profile — usuários sem perfil (COMPANY_ADMIN) são bloqueados aqui
  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    include: { company: { select: { slug: true } } },
  });

  if (!profile) redirect("/painel");

  // Busca apenas os leads deste vendedor — filtro de segurança server-side
  const rawLeads = await db.rendaInteligenteLeads.findMany({
    where: { seller_id: profile.id },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      codigo: true,
      nome: true,
      whatsapp: true,
      perfil_resultante: true,
      caminho: true,
      modalidade: true,
      kanban: true,
      created_at: true,
      dor_principal: true,
      desejo_dominante: true,
      medo_principal: true,
      objecao_provavel: true,
      prova_necessaria: true,
      pitch_sugerido: true,
      material_indicado: true,
      evitar: true,
    },
  });

  // Serializa Date → string antes de passar ao Client Component
  const leads: LeadRow[] = rawLeads.map((l) => ({
    ...l,
    perfil_resultante: l.perfil_resultante as string,
    caminho: l.caminho as string,
    modalidade: l.modalidade as string,
    kanban: l.kanban,
    created_at: l.created_at.toISOString(),
  }));

  // Templates de mensagem da empresa deste vendedor
  const rawTemplates = await db.kanbanMessageTemplate.findMany({
    where: { company_id: profile.company_id },
    select: { kanban: true, mensagem: true },
  });
  const templates: Record<string, string> = Object.fromEntries(
    rawTemplates.map((t) => [t.kanban, t.mensagem])
  );

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-bold text-gray-800">Meus Leads</h1>
        <p className="text-sm text-gray-500">
          {leads.length === 0
            ? "Nenhum lead ainda — compartilhe o link do Plano Renda Inteligente."
            : `${leads.length} lead${leads.length !== 1 ? "s" : ""} encontrado${leads.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <KanbanLeads
        leads={leads}
        templates={templates}
        companySlug={profile.company.slug}
        sellerSlug={profile.slug}
      />
    </div>
  );
}
