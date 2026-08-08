import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ChamadaLanding } from "./ChamadaLanding";

const LOGO_URL =
  "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/logo-atl-neon.png";

export const metadata: Metadata = {
  title: "Sistema Renda Inteligente",
  description:
    "Revenda de Serviços e Produtos com até 100% de lucro e Sistema de Afiliados",
};

export default async function ChamadaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const profile = await db.sellerProfile.findFirst({
    where: { slug },
    select: { id: true, name: true, company_id: true },
  });

  if (!profile) redirect("/login");

  return (
    <ChamadaLanding
      sellerId={profile.id}
      companyId={profile.company_id}
      sellerName={profile.name}
      sellerSlug={slug}
      logoUrl={LOGO_URL}
    />
  );
}
