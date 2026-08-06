import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PainelNav } from "@/components/seller/PainelNav";
import { LogoutButton } from "@/components/shared/logout-button";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { ModeSwitcher } from "@/components/shared/ModeSwitcher";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const impersonate = cookieStore.get("impersonation_token")?.value;

  if (impersonate) {
    const token = await db.impersonationToken.findUnique({
      where: { token: impersonate },
      include: { seller: { include: { company: true } } },
    });

    if (token && !token.used && token.expires_at > new Date()) {
      const profile = token.seller;
      return (
        <div className="min-h-screen bg-background">
          <ImpersonationBanner
            sellerName={profile.name}
            adminReturnUrl="/admin/vendedores"
            token={impersonate}
          />
          <PainelNav
            sellerName={profile.name}
            sellerSlug={profile.slug}
            companySlug={profile.company.slug}
            photoUrl={profile.photo_url}
            logoutButton={<LogoutButton />}
          />
          <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
        </div>
      );
    }
  }

  const session = await auth();
  if (!session?.user) redirect("/login");

  const isAdminRole =
    session.user.role === "COMPANY_ADMIN" || session.user.role === "SUPERADMIN";

  // COMPANY_ADMIN/SUPERADMIN só entra no painel com cookie view_mode=seller
  if (isAdminRole) {
    const viewMode = cookieStore.get("view_mode")?.value;
    if (viewMode !== "seller") redirect("/admin");
  }

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    include: { company: true },
  });

  // Admin sem SellerProfile não tem o que fazer no painel
  if (isAdminRole && !profile) redirect("/admin");

  if (profile?.status === "PENDING") {
    redirect("/aguardando");
  }
  if (profile?.status === "SUSPENDED") {
    redirect("/conta-suspensa");
  }

  const now = new Date();
  const subscription = profile ? await db.subscription.findFirst({
    where: { seller_id: profile.id, status: "ACTIVE", expires_at: { gt: now } },
    orderBy: { expires_at: "desc" },
  }) : null;

  const semAssinatura = profile?.status === "ACTIVE" && !subscription;

  // Sem assinatura ativa: bloqueia páginas externas (active: false) sem suspender a conta,
  // para o vendedor ainda conseguir acessar /painel/cupons e reativar.
  if (semAssinatura && profile?.active) {
    await db.sellerProfile.update({
      where: { id: profile.id },
      data: { active: false },
    });
  }

  const diasRestantes = subscription
    ? Math.ceil((new Date(subscription.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const expirandoEmBreve = diasRestantes > 0 && diasRestantes <= 10;

  return (
    <div className="min-h-screen bg-background">
      <PainelNav
        sellerName={profile?.name ?? session.user.email}
        sellerSlug={profile?.slug ?? ""}
        companySlug={profile?.company?.slug ?? ""}
        photoUrl={profile?.photo_url ?? null}
        logoutButton={<LogoutButton />}
        modeSwitcher={isAdminRole ? <ModeSwitcher currentMode="seller" /> : undefined}
      />
      {semAssinatura && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-3">
          <p className="text-sm text-amber-800">
            ⚠️ Sua conta ainda não está ativa. Ative agora para liberar o acesso completo.
          </p>
          <a
            href="/painel/cupons"
            className="text-xs font-semibold text-amber-900 underline hover:no-underline shrink-0"
          >
            Ativar agora →
          </a>
        </div>
      )}
      {expirandoEmBreve && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-3">
          <p className="text-sm text-amber-800">
            ⚠️ Sua assinatura expira em <strong>{diasRestantes} dia{diasRestantes > 1 ? "s" : ""}</strong>.
          </p>
          <a
            href="/painel/cupons"
            className="text-xs font-semibold text-amber-900 underline hover:no-underline shrink-0"
          >
            Renovar agora
          </a>
        </div>
      )}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
