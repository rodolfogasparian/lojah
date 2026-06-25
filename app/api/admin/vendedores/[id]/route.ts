import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  const { name, slug, email, password, whatsapp, status } = await req.json();

  const seller = await db.sellerProfile.findUnique({ where: { id } });
  if (!seller || seller.company_id !== session.user.companyId) {
    return NextResponse.json({ error: "Vendedor não encontrado" }, { status: 404 });
  }

  if (slug) {
    const slugExistente = await db.sellerProfile.findFirst({
      where: {
        company_id: session.user.companyId,
        slug,
        NOT: { id },
      },
    });
    if (slugExistente) {
      return NextResponse.json(
        { error: "Este usuário já está em uso por outro consultor." },
        { status: 409 }
      );
    }
  }

  await db.sellerProfile.update({
    where: { id },
    data: { name, slug, whatsapp, status, active: status === "ACTIVE" },
  });

  const userUpdate: Record<string, string> = { email };
  if (password) {
    userUpdate.password_hash = await hashPassword(password);
  }

  await db.user.update({
    where: { id: seller.user_id },
    data: userUpdate,
  });

  return NextResponse.json({ success: true });
}
