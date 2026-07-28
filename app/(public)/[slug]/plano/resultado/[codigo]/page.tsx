import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ResultadoPlano from "./ResultadoPlano";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; codigo: string }>;
}): Promise<Metadata> {
  const { codigo } = await params;
  const lead = await db.rendaInteligenteLeads.findUnique({
    where: { codigo },
    select: { nome: true },
  });
  return {
    title: lead ? `Plano Renda Inteligente de ${lead.nome} | ${codigo}` : "Plano Renda Inteligente",
    robots: { index: false, follow: false },
  };
}

export default async function ResultadoPage({
  params,
}: {
  params: Promise<{ slug: string; codigo: string }>;
}) {
  const { codigo } = await params;

  const lead = await db.rendaInteligenteLeads.findUnique({
    where: { codigo },
    include: {
      seller: { select: { name: true, whatsapp: true } },
    },
  });

  if (!lead) notFound();

  return (
    <ResultadoPlano
      lead={{
        nome: lead.nome,
        codigo: lead.codigo,
        perfil_resultante: lead.perfil_resultante,
        dor_principal: lead.dor_principal,
        desejo_dominante: lead.desejo_dominante,
        medo_principal: lead.medo_principal,
        pitch_sugerido: lead.pitch_sugerido,
        caminho: lead.caminho,
        horas_disponiveis: lead.horas_disponiveis,
      }}
      seller={{
        name: lead.seller.name,
        whatsapp: lead.seller.whatsapp?.replace(/\D/g, "") ?? "",
      }}
    />
  );
}
