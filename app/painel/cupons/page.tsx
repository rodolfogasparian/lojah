import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getPainelProfile } from "@/lib/painel-auth";
import { CopyButton } from "@/components/shared/CopyButton";
import { ModalSolicitarPack } from "@/components/seller/ModalSolicitarPack";

const PACK_LABEL: Record<string, string> = {
  ANNUAL: "Anual",
  PROMOTIONAL: "7 dias",
  MONTHLY: "Mensal",
};

export default async function PainelCuponsPage() {
  const profile = await getPainelProfile();
  if (!profile) redirect("/login");

  const now = new Date();

  const [packs, pendingRequests, activeSubscription] = await Promise.all([
    db.couponPack.findMany({
      where: { assigned_to: profile.id },
      include: {
        coupons: {
          include: { seller: { select: { name: true } } },
          orderBy: { created_at: "asc" },
        },
      },
      orderBy: { created_at: "desc" },
    }),
    db.couponRequest.findMany({
      where: { seller_id: profile.id, status: "PENDING" },
    }),
    db.subscription.findFirst({
      where: {
        seller_id: profile.id,
        status: "ACTIVE",
        expires_at: { gt: now },
      },
    }),
  ]);

  const totalCupons = packs.reduce((acc, p) => acc + p.coupons.length, 0);
  const disponiveis = packs.reduce(
    (acc, p) => acc + p.coupons.filter((c) => !c.used_by).length,
    0
  );
  const usados = totalCupons - disponiveis;

  const hasPendingPromo = pendingRequests.some((r) => r.pack_type === "PROMOTIONAL");
  const hasPendingAnual = pendingRequests.some((r) => r.pack_type === "ANNUAL");

  return (
    <div
      className="min-h-screen -mx-4 -mt-4 px-4 pt-6 pb-12"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* ── Cabeçalho ── */}
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Meus Cupons</h1>
          <p className="text-sm text-[#666] mt-1">
            Distribua os cupons para que sua equipe ative o acesso ao catálogo.
          </p>
        </div>

        {/* ── Cards de resumo ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total recebidos", value: totalCupons, color: "#1a1a1a" },
            { label: "Disponíveis", value: disponiveis, color: "#3a7d1e" },
            { label: "Utilizados", value: usados, color: "#666" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-4 text-center"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              <p className="text-2xl font-bold" style={{ color }}>
                {value}
              </p>
              <p className="text-xs text-[#888] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Lista de packs ── */}
        <section className="flex flex-col gap-4">
          {packs.map((pack) => {
            const packLabel = PACK_LABEL[pack.type] ?? pack.type;
            const isPromo = pack.type === "PROMOTIONAL";
            const packDisponiveis = pack.coupons.filter((c) => !c.used_by);
            const packUsados = pack.coupons.filter((c) => c.used_by);

            return (
              <div
                key={pack.id}
                className="bg-white rounded-xl overflow-hidden"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
              >
                {/* Header do pack */}
                <div className="px-4 py-3 border-b flex flex-wrap items-center gap-3"
                  style={{ backgroundColor: "#fafafa" }}
                >
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                    style={
                      isPromo
                        ? { backgroundColor: "#fff3cd", color: "#856404" }
                        : { backgroundColor: "#d4edda", color: "#155724" }
                    }
                  >
                    {packLabel}
                  </span>
                  <span className="text-sm text-[#666]">
                    {packDisponiveis.length} disponíveis · {packUsados.length} usados
                  </span>
                  {pack.assigned_at && (
                    <span className="text-xs text-[#999] ml-auto">
                      Recebido em{" "}
                      {new Date(pack.assigned_at).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>

                {/* Cupons disponíveis */}
                {packDisponiveis.length > 0 && (
                  <div className="divide-y">
                    {packDisponiveis.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="px-4 py-2.5 flex items-center justify-between gap-4"
                      >
                        <span className="font-mono font-bold text-sm tracking-widest text-[#1a1a1a]">
                          {coupon.code}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: "#cfee9a", color: "#1a1a1a" }}
                          >
                            Disponível
                          </span>
                          <CopyButton text={coupon.code} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cupons usados */}
                {packUsados.length > 0 && (
                  <div className="divide-y border-t">
                    {packUsados.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="px-4 py-2.5 flex items-center justify-between gap-4"
                      >
                        <span className="font-mono text-sm tracking-widest text-[#aaa] line-through">
                          {coupon.code}
                        </span>
                        <div className="text-right">
                          <p className="text-xs text-[#888]">
                            Ativado por{" "}
                            <span className="font-medium text-[#444]">
                              {coupon.seller?.name ?? "—"}
                            </span>
                          </p>
                          {coupon.used_at && (
                            <p className="text-xs text-[#aaa]">
                              {new Date(coupon.used_at).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {pack.coupons.length === 0 && (
                  <p className="px-4 py-4 text-sm text-[#999]">
                    Nenhum cupom neste pack.
                  </p>
                )}
              </div>
            );
          })}

          {packs.length === 0 && (
            <div
              className="py-12 text-center bg-white rounded-xl"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              <p className="text-[#666] text-sm">Você ainda não possui cupons.</p>
              <p className="text-[#999] text-xs mt-1">
                Compre um pack ou aguarde o administrador atribuir cupons à sua conta.
              </p>
            </div>
          )}
        </section>

        {/* ── Seções de aquisição (só para quem tem assinatura ativa) ── */}
        {activeSubscription && (
          <>
            {/* Solicitar Cupons Promocionais */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#1a1a1a]">
                  Solicitar Cupons Promocionais
                </h2>
                {hasPendingPromo && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#fff3cd", color: "#856404" }}
                  >
                    Solicitação em análise
                  </span>
                )}
              </div>

              <div
                className="bg-white rounded-xl p-5 flex flex-col gap-4"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">
                      Pack 10 cupons × 7 dias
                    </p>
                    <p className="text-sm text-[#666] mt-0.5">
                      Cupons válidos por 7 dias — ideal para promoções e eventos.
                    </p>
                  </div>
                  <p className="text-xl font-bold text-[#1a1a1a] whitespace-nowrap">
                    R$ 10,00
                  </p>
                </div>
                <ModalSolicitarPack tipo="PROMOTIONAL" preco="10,00" sellerSlug={profile.slug} />
              </div>
            </section>

            {/* Comprar Catálogo Anual */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#1a1a1a]">
                  Comprar Catálogo Anual
                </h2>
                {hasPendingAnual && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#d4edda", color: "#155724" }}
                  >
                    Solicitação em análise
                  </span>
                )}
              </div>

              <div
                className="bg-white rounded-xl p-5 flex flex-col gap-4"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">
                      Pack 10 catálogos anuais
                    </p>
                    <p className="text-sm text-[#666] mt-0.5">
                      Cada cupom dá acesso ao catálogo por 1 ano completo.
                    </p>
                  </div>
                  <p className="text-xl font-bold text-[#1a1a1a] whitespace-nowrap">
                    R$ 370,00
                  </p>
                </div>
                <ModalSolicitarPack tipo="ANNUAL" preco="370,00" sellerSlug={profile.slug} />
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}
