import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PainelNav } from "@/components/seller/PainelNav";
import { LogoutButton } from "@/components/shared/logout-button";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";

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

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    include: { company: true },
  });

  if (profile?.status === "PENDING") {
    redirect("/aguardando");
  }
  if (profile?.status === "SUSPENDED") {
    redirect("/conta-suspensa");
  }

  if (profile && profile.status === "ACTIVE") {
    const activeSubscription = await db.subscription.findFirst({
      where: {
        seller_id: profile.id,
        status: "ACTIVE",
        expires_at: { gt: new Date() },
      },
    });

    if (!activeSubscription) {
      await db.sellerProfile.update({
        where: { id: profile.id },
        data: { status: "SUSPENDED", active: false },
      });
      await db.subscription.updateMany({
        where: { seller_id: profile.id, status: "ACTIVE" },
        data: { status: "EXPIRED" },
      });
      redirect("/conta-suspensa");
    }
  }

  const subscription = profile ? await db.subscription.findFirst({
    where: { seller_id: profile.id, status: "ACTIVE" },
    orderBy: { expires_at: "desc" },
  }) : null;

  const diasRestantes = subscription
    ? Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const mostrarAviso = diasRestantes <= 10 && diasRestantes > 0;

  return (
    <div className="min-h-screen bg-background">
      <PainelNav
        sellerName={profile?.name ?? session.user.email}
        sellerSlug={profile?.slug ?? ""}
        companySlug={profile?.company?.slug ?? ""}
        photoUrl={profile?.photo_url ?? null}
        logoutButton={<LogoutButton />}
      />
      {mostrarAviso && (
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
