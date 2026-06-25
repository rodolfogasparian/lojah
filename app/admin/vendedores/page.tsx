import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { VendedorFiltros, SellerRow } from "@/components/admin/VendedorFiltros";

export default async function VendedoresPage() {
  const session = await auth();
  if (!session?.user?.companyId) redirect("/login");

  const sellers = await db.sellerProfile.findMany({
    where: { company_id: session.user.companyId },
    include: {
      user: { select: { email: true } },
      subscriptions: {
        where: { status: "ACTIVE" },
        orderBy: { expires_at: "desc" },
        take: 1,
        include: {
          coupon: {
            include: { pack: true },
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const sellerRows: SellerRow[] = sellers.map((s) => {
    const sub = s.subscriptions[0];
    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      status: s.status,
      email: s.user.email,
      expiresAt: sub?.expires_at
        ? new Date(sub.expires_at).toLocaleDateString("pt-BR")
        : null,
      packType: sub?.coupon?.pack?.type ?? null,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Vendedores</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {sellers.length} vendedor(es) cadastrado(s)
        </p>
      </div>

      <VendedorFiltros sellers={sellerRows} />
    </div>
  );
}
