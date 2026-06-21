import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/CopyButton";

export default async function CartaoPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    include: { company: true },
  });

  if (!profile) redirect("/painel/perfil");

  const companySlug = profile.company?.slug ?? "";
  const sellerSlug = profile.slug;

  const urlCliente = `https://${companySlug}.lojah.app/${sellerSlug}`;
  const urlConsultor = `https://${companySlug}.lojah.app/${sellerSlug}/c`;
  const urlRevenda = `https://${companySlug}.lojah.app/${sellerSlug}/r`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Cartão Virtual</h1>
        <p className="text-sm text-muted-foreground">
          Seus links públicos e preview do seu cartão.
        </p>
      </div>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seus links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[
            { label: "Catálogo Preço Cliente", url: urlCliente, color: "text-green-600" },
            { label: "Catálogo Preço Consultor", url: urlConsultor, color: "text-blue-600" },
            { label: "Página de Revenda", url: urlRevenda, color: "text-orange-600" },
          ].map(({ label, url, color }) => (
            <div key={url} className="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-bold ${color}`}>{label}</span>
                <span className="text-xs text-muted-foreground truncate">{url}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <CopyButton text={url} />
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="size-7 rounded-md border border-border bg-card grid place-items-center text-muted-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview do cartão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview do seu cartão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-sm">
            {profile.photo_url && (
              <img src={profile.photo_url} alt={profile.name} className="size-16 rounded-full object-cover" />
            )}
            <p className="font-bold text-base">{profile.name}</p>
            {profile.city && <p className="text-muted-foreground text-xs">📍 {[profile.city, profile.state].filter(Boolean).join(", ")}</p>}
            {profile.bio && <p className="text-xs text-muted-foreground">{profile.bio}</p>}
            {profile.whatsapp && (
              <p className="text-xs">💬 WhatsApp: {profile.whatsapp}</p>
            )}
            {profile.instagram && (
              <p className="text-xs">📸 Instagram: @{profile.instagram?.replace(/^@/, "")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
