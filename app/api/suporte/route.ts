import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { subject, message, sellerId, companyId, category } = await req.json();

  if (!subject || !message) {
    return NextResponse.json({ error: "Assunto e mensagem são obrigatórios" }, { status: 400 });
  }

  const reference = "SUP-" + randomBytes(3).toString("hex").toUpperCase();

  await db.supportTicket.create({
    data: { seller_id: sellerId, company_id: companyId, subject, message, reference, category },
  });

  return NextResponse.json({ success: true, reference });
}
