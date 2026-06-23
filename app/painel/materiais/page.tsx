import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { MaterialCard } from "@/components/seller/MaterialCard";

export default async function PainelMateriaisPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await db.sellerProfile.findFirst({
    where: { user_id: session.user.id },
  });
  if (!profile) redirect("/login");

  const materiais = await db.panelContent.findMany({
    where: {
      company_id: profile.company_id,
      type: { in: ["TUTORIAL", "VIDEO"] },
      active: true,
    },
    orderBy: { sort_order: "asc" },
    select: { id: true, title: true, content: true, url: true, type: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Materiais e Tutoriais</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acesse os materiais de apoio disponibilizados pela sua empresa
        </p>
      </div>
      <MaterialCard materiais={materiais} />
    </div>
  );
}
