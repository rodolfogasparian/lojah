"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCog, ExternalLink } from "lucide-react";
import { ImpersonateButton } from "@/components/admin/ImpersonateButton";

export interface SellerRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  email: string;
  expiresAt: string | null;
  packType: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativo",
  PENDING: "Pendente",
  SUSPENDED: "Suspenso",
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  SUSPENDED: "bg-red-100 text-red-700",
};

const PACK_BADGE: Record<string, { label: string; className: string }> = {
  PROMOTIONAL: { label: "7 dias",  className: "bg-orange-100 text-orange-700" },
  MONTHLY:     { label: "30 dias", className: "bg-blue-100 text-blue-700" },
  ANNUAL:      { label: "Anual",   className: "bg-green-100 text-green-700" },
};

export function VendedorFiltros({ sellers }: { sellers: SellerRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return sellers.filter((s) => {
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q);
      const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [sellers, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nome ou usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="ALL">Todos os status</option>
          <option value="ACTIVE">Ativo</option>
          <option value="PENDING">Pendente</option>
          <option value="SUSPENDED">Suspenso</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Usuário</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Cupom</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Expira em</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((seller) => {
              const badge = seller.packType ? PACK_BADGE[seller.packType] : null;
              return (
                <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{seller.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {seller.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {seller.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[seller.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {STATUS_LABEL[seller.status] ?? seller.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {badge ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {seller.expiresAt ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/vendedores/${seller.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <UserCog className="size-3 mr-1" /> Editar
                        </Button>
                      </Link>
                      <ImpersonateButton sellerId={seller.id} />
                      <a href={`/${seller.slug}`} target="_blank" rel="noreferrer">
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

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            {sellers.length === 0
              ? "Nenhum vendedor cadastrado ainda."
              : "Nenhum vendedor encontrado com os filtros aplicados."}
          </div>
        )}
      </div>
    </div>
  );
}
