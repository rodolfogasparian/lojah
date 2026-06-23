import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.companyId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  await db.panelContent.updateMany({
    where: { id, company_id: session.user.companyId },
    data,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.companyId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;

  await db.panelContent.deleteMany({
    where: { id, company_id: session.user.companyId, type: { in: ["TUTORIAL", "VIDEO"] } },
  });

  return NextResponse.json({ ok: true });
}
