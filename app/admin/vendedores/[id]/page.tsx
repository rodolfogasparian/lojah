import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSellerForm } from "@/components/admin/AdminSellerForm";

export default async function EditarVendedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.companyId) redirect("/login");

  const { id } = await params;

  const seller = await db.sellerProfile.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!seller || seller.company_id !== session.user.companyId) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Editar Vendedor</h1>
        <p className="text-sm text-muted-foreground mt-1">{seller.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminSellerForm seller={seller} userEmail={seller.user.email} />
        </CardContent>
      </Card>
    </div>
  );
}
