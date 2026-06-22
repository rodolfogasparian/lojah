import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

function generateCouponCode(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let block1 = "";
  let block2 = "";
  const bytes = randomBytes(8);
  for (let i = 0; i < 4; i++) {
    block1 += chars[bytes[i] % chars.length];
  }
  for (let i = 4; i < 8; i++) {
    block2 += chars[bytes[i] % chars.length];
  }
  return `${prefix}-${block1}-${block2}`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { type, quantity } = await req.json();
  const company = await db.company.findUnique({
    where: { id: session.user.companyId },
    select: { slug: true },
  });

  if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });

  const prefix = company.slug.toUpperCase().slice(0, 4);

  // Gerar códigos únicos
  const existingCodes = new Set(
    (await db.coupon.findMany({ select: { code: true } })).map(c => c.code)
  );

  const codes: string[] = [];
  let attempts = 0;
  while (codes.length < quantity && attempts < quantity * 10) {
    const code = generateCouponCode(prefix);
    if (!existingCodes.has(code) && !codes.includes(code)) {
      codes.push(code);
    }
    attempts++;
  }

  if (codes.length < quantity) {
    return NextResponse.json({ error: "Não foi possível gerar códigos únicos suficientes." }, { status: 500 });
  }

  const pack = await db.couponPack.create({
    data: {
      buyer_id: session.user.id,
      company_id: session.user.companyId,
      quantity,
      type,
      coupons: {
        create: codes.map(code => ({ code })),
      },
    },
  });

  return NextResponse.json({ success: true, packId: pack.id });
}
