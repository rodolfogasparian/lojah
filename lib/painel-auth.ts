import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getPainelProfile() {
  const cookieStore = await cookies();
  const impersonate = cookieStore.get("impersonation_token")?.value;

  if (impersonate) {
    const token = await db.impersonationToken.findUnique({
      where: { token: impersonate },
      include: { seller: { include: { company: true } } },
    });

    if (token && !token.used && token.expires_at > new Date()) {
      return token.seller;
    }
  }

  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    include: { company: true },
  });

  return profile;
}
