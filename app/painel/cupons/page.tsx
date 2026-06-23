import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CopyButton } from "@/components/shared/CopyButton";
import { CouponPurchaseModal } from "@/components/seller/CouponPurchaseModal";

export default async function PainelCuponsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await db.sellerProfile.findFirst({
    where: { user_id: session.user.id },
  });
  if (!profile) redirect("/login");

  const packs = await db.couponPack.findMany({
    where: { assigned_to: profile.id },
    include: {
      coupons: {
        include: {
          seller: { select: { name: true } },
        },
        orderBy: { created_at: "asc" },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const totalCupons = packs.reduce((acc, p) => acc + p.coupons.length, 0);
  const disponiveis = packs.reduce((acc, p) => acc + p.coupons.filter(c => !c.used_by).length, 0);
  const usados = packs.reduce((acc, p) => acc + p.coupons.filter(c => c.used_by).length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Meus Cupons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Distribua seus cupons para sua equipe se cadastrar na plataforma
          </p>
        </div>
        <CouponPurchaseModal sellerName={profile.name} sellerSlug={profile.slug} />
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold">{totalCupons}</p>
          <p className="text-xs text-muted-foreground mt-1">Total recebidos</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{disponiveis}</p>
          <p className="text-xs text-muted-foreground mt-1">Disponíveis</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{usados}</p>
          <p className="text-xs text-muted-foreground mt-1">Utilizados</p>
        </div>
      </div>

      {/* Lista de packs e cupons */}
      <div className="flex flex-col gap-4">
        {packs.map((pack) => {
          const isPromocional = pack.type === "PROMOTIONAL";
          return (
            <div key={pack.id} className="bg-white rounded-xl border overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isPromocional ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                  {isPromocional ? "Promocional 30 dias" : "Anual 1 ano"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {pack.coupons.length} cupons
                </span>
                {pack.assigned_at && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    Recebido em {new Date(pack.assigned_at).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>

              <div className="divide-y divide-border">
                {pack.coupons.map((coupon) => (
                  <div key={coupon.id} className="px-4 py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm tracking-widest">
                        {coupon.code}
                      </span>
                      {!coupon.used_by && <CopyButton text={coupon.code} />}
                    </div>
                    <div>
                      {coupon.used_by ? (
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">
                            Ativado por <span className="font-medium text-foreground">{coupon.seller?.name ?? "—"}</span>
                          </span>
                          {coupon.used_at && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(coupon.used_at).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
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
          <div className="py-12 text-center bg-white rounded-xl border">
            <p className="text-muted-foreground text-sm">Você ainda não possui cupons.</p>
            <p className="text-muted-foreground text-xs mt-1">
              Compre um pack ou aguarde o administrador atribuir cupons à sua conta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
