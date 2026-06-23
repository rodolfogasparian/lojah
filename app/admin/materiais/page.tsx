import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { MaterialForm } from "@/components/admin/MaterialForm";

export default async function AdminMateriaisPage() {
  const session = await auth();
  if (!session?.user?.companyId) redirect("/login");
  if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN") redirect("/painel");

  const materiais = await db.panelContent.findMany({
    where: {
      company_id: session.user.companyId,
      type: { in: ["TUTORIAL", "VIDEO"] },
    },
    orderBy: { sort_order: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Materiais e Tutoriais</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie os materiais de apoio disponíveis para os vendedores
        </p>
      </div>
      <MaterialForm initialMateriais={materiais} />
    </div>
  );
}
