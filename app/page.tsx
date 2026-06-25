import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LandingPage from "@/components/landing/LandingPage";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    if (session.user.role === "SUPERADMIN") redirect("/master");
    if (session.user.role === "COMPANY_ADMIN") redirect("/admin");
    redirect("/painel");
  }

  return <LandingPage />;
}
