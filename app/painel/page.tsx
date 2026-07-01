import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/CopyButton";

export default async function PainelPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    include: { company: true },
  });

  if (!profile) redirect("/painel/perfil");

  const subscription = await db.subscription.findFirst({
    where: {
      seller: { user_id: session.user.id },
      status: "ACTIVE",
      expires_at: { gt: new Date() },
    },
    orderBy: { expires_at: "desc" },
  });

  const diasRestantes = subscription
    ? Math.ceil(
        (new Date(subscription.expires_at).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const companySlug = profile.company?.slug ?? "";
  const sellerSlug = profile.slug;
  const base = `https://${companySlug}.lojah.app/${sellerSlug}`;

  const links = [
    {
      label: "Catálogo Preço Cliente",
      description: "Compartilhe com seus clientes",
      url: base,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      label: "Catálogo Preço Consultor",
      description: "50% de desconto para consultores",
      url: `${base}/desconto`,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      label: "Cartão Virtual",
      description: "Seu cartão de visitas digital",
      url: `https://${companySlug}.lojah.app/${sellerSlug}/cartao`,
      color: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      label: "Página de Cadastro de Vendedores",
      description: "Indique e cadastre novos consultores",
      url: `${base}/revenda`,
      color: "text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
    {
      label: "Página de Indicação do Catálogo",
      description: "Indique o catálogo e ganhe clientes",
      url: `https://atlantica.lojah.app/atlantica/${profile.slug}`,
      color: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
  ];

  const categoryLinks = [
    {
      label: "Catálogo — Perfumes 15ml",
      description: "Link direto para perfumes 15ml",
      url: `https://atlantica.lojah.app/${profile.slug}/perfumes`,
      color: "text-purple-600",
    },
    {
      label: "Catálogo — Linha Ozonizada",
      description: "Link direto para linha ozonizada",
      url: `https://atlantica.lojah.app/${profile.slug}?categoria=Linha+Ozonizada`,
      color: "text-green-600",
    },
    {
      label: "Catálogo — Suplementos",
      description: "Link direto para suplementos e nutracêuticos",
      url: `https://atlantica.lojah.app/${profile.slug}?categoria=Suplementos+e+Nutrac%C3%AAuticos`,
      color: "text-blue-600",
    },
    {
      label: "Catálogo — Telemedicina",
      description: "Link direto para planos de saúde",
      url: `https://atlantica.lojah.app/${profile.slug}?categoria=Telemedicina`,
      color: "text-red-600",
    },
    {
      label: "Catálogo — Telefonia",
      description: "Link direto para planos ATL NEX",
      url: `https://atlantica.lojah.app/${profile.slug}?categoria=Telefonia`,
      color: "text-cyan-600",
    },
    {
      label: "Catálogo — Serviços",
      description: "Link direto para ATL Services completo",
      url: `https://atlantica.lojah.app/${profile.slug}/servicos`,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Olá, {profile.name.split(" ")[0]}! 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Seus links de indicação estão prontos para compartilhar.
        </p>
      </div>

      {/* Card destaque catálogo */}
      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 shrink-0">
            <img
              src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/catalogo.jpg"
              alt="Catálogo Atlântica Natural"
              className="w-full h-48 sm:h-full object-cover"
            />
          </div>
          <div className="flex-1 p-5 flex flex-col justify-center gap-3">
            <div>
              <h2 className="font-bold text-lg leading-tight">Catálogo Atlântica Natural</h2>
              <p className="text-sm text-muted-foreground mt-1">Compartilhe seu catálogo personalizado com seus clientes</p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={`https://atlantica.lojah.app/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                🛍️ Catálogo cliente
              </a>
              <a
                href={`https://atlantica.lojah.app/${profile.slug}/desconto`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                💼 Catálogo consultor (50% OFF)
              </a>
              <a
                href={`https://atlantica.lojah.app/${profile.slug}/revenda`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                🤝 Página de revenda
              </a>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🔗 Seus links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {links.map(({ label, description, url, color, bg, border }) => (
            <div
              key={url}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${bg} ${border}`}
            >
              <div className="flex flex-col min-w-0">
                <span className={`text-sm font-bold ${color}`}>{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
                <span className="text-[11px] text-gray-500 truncate mt-0.5 font-mono">{url}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <CopyButton text={url} />
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="size-7 rounded-md border border-border bg-white grid place-items-center text-muted-foreground hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🔗 Links por Categoria</CardTitle>
          <p className="text-xs text-muted-foreground">Compartilhe links diretos para cada categoria do catálogo</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {categoryLinks.map(({ label, description, url, color }) => (
            <div
              key={url}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-muted/30"
            >
              <div className="flex flex-col min-w-0">
                <span className={`text-sm font-bold ${color}`}>{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
                <span className="text-[11px] text-gray-500 truncate mt-0.5 font-mono">{url}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <CopyButton text={url} />
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="size-7 rounded-md border border-border bg-white grid place-items-center text-muted-foreground hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {diasRestantes !== null && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${
          diasRestantes <= 30
            ? "bg-red-50 border border-red-200"
            : diasRestantes <= 90
            ? "bg-amber-50 border border-amber-200"
            : "bg-green-50 border border-green-200"
        }`}>
          <div className={`text-2xl font-bold ${
            diasRestantes <= 30 ? "text-red-600" : diasRestantes <= 90 ? "text-amber-600" : "text-green-600"
          }`}>
            {diasRestantes}
          </div>
          <div>
            <p className="text-sm font-semibold">
              {diasRestantes <= 30 ? "⚠️ Assinatura expirando em breve!" : "✅ Assinatura ativa"}
            </p>
            <p className="text-xs text-muted-foreground">
              {diasRestantes === 1 ? "Último dia" : `${diasRestantes} dias restantes`}
              {subscription && ` — expira em ${new Date(subscription.expires_at).toLocaleDateString("pt-BR")}`}
            </p>
          </div>
        </div>
      )}

      {diasRestantes === null && (
        <div className="rounded-xl p-4 flex items-center gap-3 bg-amber-50 border border-amber-200">
          <div className="text-2xl">⚠️</div>
          <div>
            <p className="text-sm font-semibold text-amber-700">Sem assinatura ativa</p>
            <p className="text-xs text-muted-foreground">
              Ative sua conta com um cupom ou adquira uma assinatura.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
