import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SellerProfileForm } from "@/components/seller/seller-profile-form";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "lojah.app";

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.companyId) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sem empresa vinculada</CardTitle>
            <CardDescription>
              Sua conta ainda não está associada a nenhuma empresa, então não
              é possível criar seu perfil de vendedor agora.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const [company, profile] = await Promise.all([
    db.company.findUnique({ where: { id: session.user.companyId } }),
    db.sellerProfile.findUnique({ where: { user_id: session.user.id } }),
  ]);

  const publicBaseUrl = company ? `${company.slug}.${APP_DOMAIN}` : APP_DOMAIN;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Seu perfil de vendedor</CardTitle>
          <CardDescription>
            Essas informações aparecem na sua página pública.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SellerProfileForm
            initialProfile={profile}
            publicBaseUrl={publicBaseUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}
