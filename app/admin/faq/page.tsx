import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FaqForm } from "@/components/admin/FaqForm";

export default async function AdminFaqPage() {
  const session = await auth();
  if (!session?.user?.companyId && session?.user?.role !== "SUPERADMIN") redirect("/login");
  if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN") redirect("/painel");

  const companyId = session.user.companyId ?? "none";

  const faqs = (
    await db.panelContent.findMany({
      where: { company_id: companyId, type: "FAQ" },
      orderBy: { sort_order: "asc" },
    })
  ).map(faq => ({ ...faq, content: faq.content ?? "" }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">FAQ</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie as perguntas frequentes visíveis para os vendedores
        </p>
      </div>
      <FaqForm initialFaqs={faqs} />
    </div>
  );
}
