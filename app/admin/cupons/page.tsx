import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CopyButton } from "@/components/shared/CopyButton";
import { AssignCouponModal } from "@/components/admin/AssignCouponModal";
import { AprovarSolicitacaoButton } from "@/components/admin/AprovarSolicitacaoButton";

export default async function CuponsPage() {
  const session = await auth();
  if (!session?.user?.companyId && session?.user?.role !== "SUPERADMIN") redirect("/login");

  const companyId = session.user.companyId ?? "none";

  const [packs, pendingRequests] = await Promise.all([
    db.couponPack.findMany({
    where: { company_id: companyId },
    include: {
      coupons: {
        include: {
          seller: { select: { name: true } },
        },
        orderBy: { created_at: "asc" },
      },
      seller: { select: { name: true, slug: true } },
    },
      orderBy: { created_at: "desc" },
    }),
    db.couponRequest.findMany({
      where: { company_id: session.user.companyId, status: "PENDING" },
      include: { seller: { select: { name: true, slug: true } } },
      orderBy: { created_at: "asc" },
    }),
  ]);

  const PACK_LABEL: Record<string, string> = {
    PROMOTIONAL: "7 dias",
    ANNUAL: "Anual",
    MONTHLY: "30 dias",
  };
  const PACK_VALOR: Record<string, string> = {
    PROMOTIONAL: "R$ 10,00",
    ANNUAL: "R$ 370,00",
    MONTHLY: "R$ 40,00",
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Solicitações Pendentes ── */}
      {pendingRequests.length > 0 && (
        <div
          className="rounded-xl border p-5 flex flex-col gap-4"
          style={{ backgroundColor: "#fef9c3", borderColor: "#fde68a" }}
        >
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-[#1a1a1a]">
              Solicitações aguardando aprovação
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: "#d97706" }}
            >
              {pendingRequests.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="flex flex-col gap-0.5">
                  <p className="font-semibold text-sm text-[#1a1a1a]">
                    {req.seller.name}{" "}
                    <span className="font-normal text-[#888]">
                      @{req.seller.slug}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      {PACK_LABEL[req.pack_type] ?? req.pack_type}
                    </span>
                    <span className="text-xs text-[#666]">
                      {req.quantity} cupons
                    </span>
                    <span className="text-xs font-semibold text-[#1a1a1a]">
                      {PACK_VALOR[req.pack_type] ?? "—"}
                    </span>
                    <span className="text-xs text-[#999]">
                      {new Date(req.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <AprovarSolicitacaoButton requestId={req.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cupons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {packs.length} pack(s) criado(s)
          </p>
        </div>
        <Link href="/admin/cupons/novo">
          <Button>
            <Plus className="size-4 mr-1" /> Novo pack
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {packs.map((pack) => {
          const usados = pack.coupons.filter(c => c.used_by).length;
          const disponiveis = pack.coupons.filter(c => !c.used_by).length;
          const isPromocional = pack.type === "PROMOTIONAL";
          const atribuido = !!pack.assigned_to;

          return (
            <div key={pack.id} className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    pack.type === "ANNUAL"      ? "bg-green-100 text-green-700"  :
                    pack.type === "PROMOTIONAL" ? "bg-orange-100 text-orange-700" :
                                                  "bg-blue-100 text-blue-700"
                  }`}>
                    {PACK_LABEL[pack.type] ?? pack.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {pack.coupons.length} cupons — {disponiveis} disponíveis / {usados} usados
                  </span>
                  {atribuido ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      👤 {pack.seller?.name} (@{pack.seller?.slug})
                      {pack.assigned_at && ` · ${new Date(pack.assigned_at).toLocaleDateString("pt-BR")}`}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                      Não atribuído
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!atribuido && (
                    <AssignCouponModal
                      packId={pack.id}
                      packType={pack.type}
                      quantity={pack.coupons.length}
                    />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(pack.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border">
                {pack.coupons.map((coupon) => (
                  <div key={coupon.id} className="px-4 py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm tracking-widest">
                        {coupon.code}
                      </span>
                      <CopyButton text={coupon.code} />
                    </div>
                    <div className="flex items-center gap-2">
                      {coupon.used_by ? (
                        <span className="text-xs text-muted-foreground">
                          Usado por: <span className="font-medium text-foreground">{coupon.seller?.name ?? "—"}</span>
                          {coupon.used_at && ` em ${new Date(coupon.used_at).toLocaleDateString("pt-BR")}`}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Disponível
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {packs.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-xl border">
            Nenhum pack criado ainda. Clique em "Novo pack" para começar.
          </div>
        )}
      </div>
    </div>
  );
}
