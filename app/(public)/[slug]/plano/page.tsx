import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCompanyFromHost } from "@/lib/tenant";
import { PlanoQuiz } from "./PlanoQuiz";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await db.sellerProfile.findFirst({
    where: { slug },
    select: { name: true },
  });
  const name = profile?.name ?? "Consultor(a)";
  return {
    title: `Plano Renda Inteligente | Indicação de ${name}`,
    description:
      "Responda 11 perguntas e receba um diagnóstico personalizado do caminho ideal para você gerar renda.",
  };
}

export default async function PlanoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await getCompanyFromHost();
  if (!company) notFound();

  const seller = await db.sellerProfile.findUnique({
    where: { company_id_slug: { company_id: company.id, slug } },
  });
  if (!seller || !seller.active) notFound();

  const whatsappDigits = seller.whatsapp?.replace(/\D/g, "") ?? "";

  return (
    <PlanoQuiz
      sellerId={seller.id}
      companyId={company.id}
      sellerName={seller.name}
      sellerWhatsapp={whatsappDigits}
      sellerSlug={slug}
      companySlug={company.slug}
    />
  );
}
