import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { code } = await req.json();
  if (!code) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }

  // Buscar cupom
  const coupon = await db.coupon.findUnique({
    where: { code },
    include: { pack: { include: { company: true } } },
  });

  if (!coupon) {
    return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 });
  }

  if (coupon.used_by) {
    return NextResponse.json({ error: "Este cupom já foi utilizado" }, { status: 400 });
  }

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
  });

  if (!profile) {
    return NextResponse.json(
      { error: "Perfil de vendedor não encontrado. Certifique-se de estar logado como vendedor, não como administrador." },
      { status: 404 }
    );
  }

  if (coupon.pack.company_id !== profile.company_id) {
    return NextResponse.json({ error: "Este cupom não é válido para a sua empresa" }, { status: 400 });
  }

  const packType = coupon.pack.type;
  const now = new Date();
  const expiresAt = new Date(now);

  if (packType === "PROMOTIONAL") {
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 ano
  }

  await db.$transaction(async (tx) => {
    await tx.coupon.update({
      where: { id: coupon.id },
      data: {
        used_by: profile.id,
        used_at: now,
        expires_at: expiresAt,
      },
    });

    await tx.sellerProfile.update({
      where: { id: profile.id },
      data: { status: "ACTIVE", active: true },
    });

    await tx.subscription.create({
      data: {
        seller_id: profile.id,
        status: "ACTIVE",
        activated_at: now,
        expires_at: expiresAt,
        coupon_id: coupon.id,
      },
    });
  });

  return NextResponse.json({ success: true });
}
