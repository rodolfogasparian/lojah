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
      url: `${base}/c`,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      label: "Cartão Virtual",
      description: "Seu cartão de visitas digital",
      url: `https://${companySlug}.lojah.app/${sellerSlug}#cartao`,
      color: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      label: "Página de Cadastro de Vendedores",
      description: "Indique e cadastre novos consultores",
      url: `${base}/r`,
      color: "text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-200",
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
    </div>
  );
}
