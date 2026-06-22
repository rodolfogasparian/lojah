import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCog, ExternalLink } from "lucide-react";
import { ImpersonateButton } from "@/components/admin/ImpersonateButton";

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
      },
    },
    orderBy: { created_at: "desc" },
  });

  const statusLabel: Record<string, string> = {
    ACTIVE: "Ativo",
    PENDING: "Pendente",
    SUSPENDED: "Suspenso",
  };

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    SUSPENDED: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendedores</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sellers.length} vendedor(es) cadastrado(s)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Usuário</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Expira em</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sellers.map((seller) => {
              const sub = seller.subscriptions[0];
              const expiresAt = sub?.expires_at
                ? new Date(sub.expires_at).toLocaleDateString("pt-BR")
                : "—";

              return (
                <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{seller.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {seller.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {seller.user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[seller.status]}`}>
                      {statusLabel[seller.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {expiresAt}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/vendedores/${seller.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <UserCog className="size-3 mr-1" /> Editar
                        </Button>
                      </Link>
                      <ImpersonateButton sellerId={seller.id} />
                      <a
                        href={`/${seller.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <ExternalLink className="size-3" />
                        </Button>
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sellers.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Nenhum vendedor cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
