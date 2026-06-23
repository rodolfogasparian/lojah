import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.companyId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const materiais = await db.panelContent.findMany({
    where: {
      company_id: session.user.companyId,
      type: { in: ["TUTORIAL", "VIDEO"] },
    },
    orderBy: { sort_order: "asc" },
  });

  return NextResponse.json(materiais);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.companyId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { title, content, url, type, sort_order } = await req.json();
  if (!title || !type) return NextResponse.json({ error: "Título e tipo são obrigatórios" }, { status: 400 });

  const material = await db.panelContent.create({
    data: {
      company_id: session.user.companyId,
      type,
      title,
      content,
      url,
      sort_order: sort_order ?? 0,
      active: true,
    },
  });

  return NextResponse.json(material);
}
