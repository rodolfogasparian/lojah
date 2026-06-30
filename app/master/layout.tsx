import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MasterNav } from "@/components/master/MasterNav";
import { LogoutButton } from "@/components/shared/logout-button";

export default async function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPERADMIN") redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <MasterNav
        adminEmail={session.user.email ?? ""}
        logoutButton={<LogoutButton />}
      />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
