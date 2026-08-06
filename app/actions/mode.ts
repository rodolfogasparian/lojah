"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

async function assertAdminRole() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    throw new Error("Não autorizado");
  }
}

export async function switchToSeller(): Promise<void> {
  await assertAdminRole();
  const store = await cookies();
  store.set("view_mode", "seller", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/painel/plano-de-acao/meu");
}

export async function switchToAdmin(): Promise<void> {
  await assertAdminRole();
  const store = await cookies();
  store.delete("view_mode");
  redirect("/admin");
}
