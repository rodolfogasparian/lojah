import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.companyId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { packId, sellerProfileId } = await req.json();
  if (!packId || !sellerProfileId) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  // Valida que o pack pertence à empresa do admin
  const pack = await db.couponPack.findFirst({
    where: { id: packId, company_id: session.user.companyId },
  });
  if (!pack) return NextResponse.json({ error: "Pack não encontrado" }, { status: 404 });

  // Valida que o vendedor pertence à empresa
  const seller = await db.sellerProfile.findFirst({
    where: { id: sellerProfileId, company_id: session.user.companyId },
  });
  if (!seller) return NextResponse.json({ error: "Vendedor não encontrado" }, { status: 404 });

  const updated = await db.couponPack.update({
    where: { id: packId },
    data: { assigned_to: sellerProfileId, assigned_at: new Date() },
  });

  return NextResponse.json(updated);
}
