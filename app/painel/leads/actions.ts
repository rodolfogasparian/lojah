"use server";

// Página exclusiva de vendedor (SELLER).
// COMPANY_ADMIN não tem seller_profile — não acessa estes dados.
// A visão do admin (todos os leads da empresa) é entrega futura separada.

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LeadKanban } from "@prisma/client";

export async function moverLead(leadId: string, novaColuna: LeadKanban): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado");

  // Recupera o seller_profile do usuário logado — filtro de segurança server-side
  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    select: { id: true },
  });
  if (!profile) throw new Error("Perfil de vendedor não encontrado");

  // Garante que o lead pertence a este vendedor — nunca confia no client
  const lead = await db.rendaInteligenteLeads.findUnique({
    where: { id: leadId },
    select: { seller_id: true },
  });
  if (!lead || lead.seller_id !== profile.id) {
    throw new Error("Lead não encontrado ou acesso negado");
  }

  await db.rendaInteligenteLeads.update({
    where: { id: leadId },
    data: { kanban: novaColuna },
  });

  revalidatePath("/painel/leads");
}
