import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getPainelProfile } from "@/lib/painel-auth";
import { FaqAccordion } from "@/components/seller/FaqAccordion";

export default async function PainelFaqPage() {
  const profile = await getPainelProfile();
  if (!profile) redirect("/login");

  const faqs = (
    await db.panelContent.findMany({
      where: { company_id: profile.company_id, type: "FAQ", active: true },
      orderBy: { sort_order: "asc" },
      select: { id: true, title: true, content: true },
    })
  ).map(faq => ({ ...faq, content: faq.content ?? "" }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dúvidas Frequentes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Encontre respostas para as principais dúvidas sobre a plataforma
        </p>
      </div>
      <FaqAccordion faqs={faqs} />
    </div>
  );
}
