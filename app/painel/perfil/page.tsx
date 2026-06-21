import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { SellerProfileForm } from "@/components/seller/seller-profile-form";

export default async function PainelPerfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    include: { company: true },
  });

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
