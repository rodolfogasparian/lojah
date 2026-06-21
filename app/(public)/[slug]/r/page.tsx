import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { getCompanyFromHost } from "@/lib/tenant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BENEFITS = [
  {
    emoji: "💰",
    title: "Ganhos reais",
    description: "Compre com 50% de desconto e venda pelo preço cheio",
  },
  {
    emoji: "🕐",
    title: "Flexibilidade total",
    description: "Você escolhe quando e quanto quer trabalhar",
  },
  {
    emoji: "🚀",
    title: "Suporte completo",
    description: "Treinamentos, materiais e apoio do seu consultor",
  },
];

export default async function RevendaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await getCompanyFromHost();
  if (!company) {
    notFound();
  }

  const seller = await db.sellerProfile.findUnique({
    where: { company_id_slug: { company_id: company.id, slug } },
  });
  if (!seller || !seller.active) {
    notFound();
  }

  const whatsappDigits = seller.whatsapp?.replace(/\D/g, "");
  const signupText = seller.signup_button_text ?? "Quero ser consultora!";
  const signupUrl =
    seller.signup_button_url ?? "https://cadastro.atlanticanatural.com.br/codigos";

  return (
    <div className="flex w-full flex-1 flex-col items-center px-4 py-8">
      <div className="flex w-full max-w-md flex-col gap-8">
        <header className="flex items-center justify-between">
          {company.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo vem de URL livre, não cadastrada em remotePatterns
            <img
              src={company.logo_url}
              alt={company.name}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <span className="text-sm font-bold text-primary">{company.name}</span>
          )}

          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarImage src={seller.photo_url ?? undefined} alt={seller.name} />
              <AvatarFallback>{seller.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold">{seller.name}</span>
          </div>
        </header>

        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-2xl font-bold leading-tight">
            Seja um(a) Consultor(a) {company.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Trabalhe de casa, no seu tempo, com produtos que as pessoas adoram.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <span className="text-2xl">{benefit.emoji}</span>
              <div>
                <p className="text-sm font-bold">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <a
          href={signupUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#25D366] text-base font-bold text-white transition-colors hover:bg-[#1ebe57]"
        >
          {signupText}
        </a>

        {whatsappDigits && (
          <a
            href={`https://wa.me/${whatsappDigits}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"
          >
            <MessageCircle className="size-3.5" />
            Dúvidas? Fale com {seller.name}
          </a>
        )}
      </div>
    </div>
  );
}
