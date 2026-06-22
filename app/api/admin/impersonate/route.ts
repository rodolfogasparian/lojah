import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { sellerId } = await req.json();

  const seller = await db.sellerProfile.findUnique({ where: { id: sellerId } });
  if (!seller) return NextResponse.json({ error: "Vendedor não encontrado" }, { status: 404 });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await db.impersonationToken.create({
    data: {
      token,
      admin_id: session.user.id,
      seller_id: sellerId,
      expires_at: expiresAt,
    },
  });

  return NextResponse.json({ token });
}
