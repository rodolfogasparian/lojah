"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function solicitarPack(tipo: "PROMOTIONAL" | "ANNUAL") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const profile = await db.sellerProfile.findFirst({
    where: { user_id: session.user.id },
  });
  if (!profile) throw new Error("Perfil não encontrado");

  await db.couponRequest.create({
    data: {
      seller_id: profile.id,
      company_id: profile.company_id,
      pack_type: tipo,
      quantity: 10,
      status: "PENDING",
    },
  });

  return { success: true };
}
