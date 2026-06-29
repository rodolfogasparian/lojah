import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import LandingNaturais from "@/components/landing/LandingNaturais";
import { defaultPageData } from "@/lib/landing-naturais-defaults";

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
