import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.companyId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const faqs = await db.panelContent.findMany({
    where: { company_id: session.user.companyId, type: "FAQ" },
    orderBy: { sort_order: "asc" },
  });

  return NextResponse.json(faqs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.companyId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { title, content, sort_order } = await req.json();
  if (!title || !content) return NextResponse.json({ error: "Pergunta e resposta são obrigatórias" }, { status: 400 });

  const faq = await db.panelContent.create({
    data: {
      company_id: session.user.companyId,
      type: "FAQ",
      title,
      content,
      sort_order: sort_order ?? 0,
      active: true,
    },
  });

  return NextResponse.json(faq);
}
