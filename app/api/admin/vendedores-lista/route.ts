import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.companyId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const vendedores = await db.sellerProfile.findMany({
    where: { company_id: session.user.companyId, active: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(vendedores);
}
