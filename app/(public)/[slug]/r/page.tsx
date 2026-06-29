import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import LandingNaturais from "@/components/landing/LandingNaturais";
import { defaultPageData } from "@/lib/landing-naturais-defaults";

const OG_IMAGE = "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/renda-recorrente-neon.png";
const DESCRIPTION = "Lucre até 100% com o maior ecossistema de produtos e serviços do Brasil!";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await db.sellerProfile.findFirst({
    where: { slug },
    select: { name: true, slug: true },
  });

  const name = profile?.name ?? "Atlântica Natural";
  const title = `${name} | Ecossistema Atlântica Natural`;

  return {
    title,
    description: DESCRIPTION,
    openGraph: {
      title,
      description: DESCRIPTION,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Ecossistema Atlântica Natural" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: DESCRIPTION,
      images: [OG_IMAGE],
    },
  };
}

export default async function RevendaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const profile = await db.sellerProfile.findFirst({
    where: { slug },
    include: { company: true },
  });

  if (!profile) redirect("/login");

  return (
    <LandingNaturais
      data={{
        ...defaultPageData,
        whatsapp: profile.whatsapp ?? "5545999463907",
        brand: {
          name: profile.name,
          logoUrl:
            "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/logo-atl-neon.png",
        },
        hero: {
          ...defaultPageData.hero,
          ctaLabel: profile.signup_button_text ?? "Quero ser representante",
        },
      }}
    />
  );
}
