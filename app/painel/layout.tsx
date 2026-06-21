import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PainelNav } from "@/components/seller/PainelNav";
import { LogoutButton } from "@/components/shared/logout-button";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    include: { company: true },
  });

  return (
    <div className="min-h-screen bg-background">
      <PainelNav
        sellerName={profile?.name ?? session.user.email}
        sellerSlug={profile?.slug ?? ""}
        companySlug={profile?.company?.slug ?? ""}
        photoUrl={profile?.photo_url ?? null}
        logoutButton={<LogoutButton />}
      />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
