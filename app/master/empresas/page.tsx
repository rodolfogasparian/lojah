import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function MasterEmpresasPage() {
  const empresas = await db.company.findMany({
    include: {
      _count: { select: { seller_profiles: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Empresas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {empresas.length} empresa(s) cadastrada(s)
          </p>
        </div>
        <Link href="/master/empresas/nova">
          <Button>
            <Plus className="size-4 mr-1" /> Nova empresa
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Vendedores</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Criada em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {empresas.map((empresa) => (
              <tr key={empresa.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">{empresa.name}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  {empresa.slug}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {empresa._count.seller_profiles}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      empresa.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {empresa.active ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                  {new Date(empresa.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {empresas.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Nenhuma empresa cadastrada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
