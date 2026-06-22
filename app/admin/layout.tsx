import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (
    session.user.role !== "COMPANY_ADMIN" &&
    session.user.role !== "SUPERADMIN"
  ) {
    redirect("/painel");
  }

  const company = session.user.companyId
    ? await db.company.findUnique({
        where: { id: session.user.companyId },
        select: { name: true, slug: true },
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav
        adminEmail={session.user.email}
        companyName={company?.name ?? "Lojah Admin"}
      />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
