import { Card, CardContent } from "@/components/ui/card";
import { SellerProfileForm } from "@/components/seller/seller-profile-form";
import { getPainelProfile } from "@/lib/painel-auth";

export default async function PainelPerfilPage() {
  const profile = await getPainelProfile();

  const companySlug = profile?.company?.slug ?? "";
  const sellerSlug = profile?.slug ?? "";
  const publicUrl = companySlug && sellerSlug
    ? `https://${companySlug}.lojah.app/${sellerSlug}`
    : "";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">
          Essas informações aparecem na sua vitrine pública.
        </p>
        {publicUrl && (
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary underline mt-1 inline-block"
          >
            {publicUrl}
          </a>
        )}
      </div>
      <Card>
        <CardContent className="pt-6">
          <SellerProfileForm
            initialProfile={profile}
            publicBaseUrl={companySlug ? `${companySlug}.lojah.app` : "lojah.app"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
