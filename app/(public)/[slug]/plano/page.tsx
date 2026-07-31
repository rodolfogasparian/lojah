import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCompanyFromHost } from "@/lib/tenant";
import { PlanoQuiz } from "./PlanoQuiz";

const OG_IMAGE =
  "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/imagens/share-plano-renda-inteligente.png";

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
  const title = `Plano Renda Inteligente | Indicação de ${name}`;
  const description =
    "Responda algumas perguntas e receba, na hora, o perfil e a recomendação certa pra você — leva menos de 3 minutos.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Plano Renda Inteligente" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
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
