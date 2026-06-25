"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

function gerarCodigo(prefix: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const parte = (n: number) =>
    Array.from({ length: n }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  return `${prefix}-${parte(4)}-${parte(4)}`;
}

export async function aprovarSolicitacao(requestId: string) {
  const session = await auth();
  if (
    !session?.user?.companyId ||
    (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    throw new Error("Não autorizado");
  }

  const request = await db.couponRequest.findUnique({
    where: { id: requestId },
    include: { seller: { select: { id: true, user_id: true } } },
  });

  if (!request || request.status !== "PENDING") {
    throw new Error("Solicitação não encontrada ou já processada");
  }
  if (request.company_id !== session.user.companyId) {
    throw new Error("Não autorizado");
  }

  const now = new Date();
  const expiresAt = new Date(now);
  if (request.pack_type === "PROMOTIONAL") {
    expiresAt.setDate(expiresAt.getDate() + 7);
  } else if (request.pack_type === "MONTHLY") {
    expiresAt.setDate(expiresAt.getDate() + 30);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  const prefix = "ATLA";
  const codigos: string[] = [];
  for (let i = 0; i < request.quantity; i++) {
    let codigo = gerarCodigo(prefix);
    while (await db.coupon.findUnique({ where: { code: codigo } })) {
      codigo = gerarCodigo(prefix);
    }
    codigos.push(codigo);
  }

  await db.$transaction(async (tx) => {
    await tx.couponPack.create({
      data: {
        buyer_id: request.seller.user_id,
        company_id: request.company_id,
        quantity: request.quantity,
        type: request.pack_type,
        assigned_to: request.seller_id,
        assigned_at: now,
        notes: `Aprovado pelo admin — Solicitação #${requestId.slice(0, 8)}`,
        coupons: {
          create: codigos.map((code) => ({ code })),
        },
      },
    });

    await tx.couponRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        approved_at: now,
        approved_by: session.user.id,
      },
    });
  });

  revalidatePath("/admin/cupons");
}
