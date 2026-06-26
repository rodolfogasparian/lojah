import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { boasVindasTemplate } from "@/lib/email-templates/boas-vindas";
import { novaCompraTemplate } from "@/lib/email-templates/nova-compra";

const HOTTOK = process.env.HOTMART_HOTTOK;
const COMPANY_SLUG = "atlantica";
const OFFER_PACK = "o2ppbpn2";

function gerarSenha(): string {
  const nums = Math.floor(1000 + Math.random() * 9000);
  return `Atl@${nums}`;
}

function gerarSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 30);
}

async function slugUnico(base: string, companyId: string): Promise<string> {
  let slug = base;
  let contador = 2;
  while (true) {
    const existe = await db.sellerProfile.findUnique({
      where: { company_id_slug: { company_id: companyId, slug } },
    });
    if (!existe) return slug;
    slug = `${base}-${contador}`;
    contador++;
  }
}

function gerarCodigo(prefix: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const parte = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${prefix}-${parte(4)}-${parte(4)}`;
}

export async function POST(req: Request) {
  try {
    // Valida token Hotmart
    const hottok = req.headers.get("x-hotmart-hottok");
    if (HOTTOK && hottok !== HOTTOK) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Só processa compra aprovada
    const event = body?.event ?? body?.data?.event;
    if (event !== "PURCHASE_COMPLETE" && event !== "PURCHASE_APPROVED") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const email: string = body?.data?.buyer?.email;
    const nome: string = body?.data?.buyer?.name ?? email.split("@")[0];
    const offerCode: string = body?.data?.offer?.code ?? "";
    const isPack = offerCode === OFFER_PACK;
    const qtdCupons = isPack ? 10 : 1;

    if (!email) {
      return NextResponse.json({ error: "Email não encontrado" }, { status: 400 });
    }

    // Busca empresa
    const company = await db.company.findUnique({ where: { slug: COMPANY_SLUG } });
    if (!company) {
      return NextResponse.json({ error: "Empresa não encontrada" }, { status: 500 });
    }

    // Verifica se usuário já existe
    let user = await db.user.findUnique({ where: { email } });
    let profile = user
      ? await db.sellerProfile.findFirst({ where: { user_id: user.id } })
      : null;

    const senha = gerarSenha();
    const passwordHash = await hashPassword(senha);
    const isNewUser = !user;

    if (!user) {
      // Cria usuário novo
      const slugBase = gerarSlug(nome);
      const slug = await slugUnico(slugBase || "consultor", company.id);

      user = await db.user.create({
        data: {
          email,
          password_hash: passwordHash,
          role: "SELLER",
          company_id: company.id,
        },
      });

      // Cria assinatura ativa por 1 ano
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      profile = await db.sellerProfile.create({
        data: {
          user_id: user.id,
          company_id: company.id,
          slug,
          name: nome,
          status: "ACTIVE",
          signup_button_text: "Fazer cadastro",
          signup_button_url: "https://cadastro.atlanticanatural.com.br/" + slug,
          subscriptions: {
            create: {
              status: "ACTIVE",
              activated_at: new Date(),
              expires_at: expiresAt,
              notes: `Ativado via Hotmart - ${isPack ? "Pack 10" : "Individual"}`,
            },
          },
        },
      });
    } else if (!profile) {
      // Usuário existe mas sem perfil
      const slugBase = gerarSlug(nome);
      const slug = await slugUnico(slugBase || "consultor", company.id);

      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      profile = await db.sellerProfile.create({
        data: {
          user_id: user.id,
          company_id: company.id,
          slug,
          name: nome,
          status: "ACTIVE",
          signup_button_url: "https://cadastro.atlanticanatural.com.br/" + slug,
          subscriptions: {
            create: {
              status: "ACTIVE",
              activated_at: new Date(),
              expires_at: expiresAt,
              notes: `Ativado via Hotmart - ${isPack ? "Pack 10" : "Individual"}`,
            },
          },
        },
      });
    }

    // Gera pack de cupons e atribui ao vendedor
    const prefix = "ATLA";
    const codigos: string[] = [];
    for (let i = 0; i < qtdCupons; i++) {
      let codigo = gerarCodigo(prefix);
      // Garante unicidade
      while (await db.coupon.findUnique({ where: { code: codigo } })) {
        codigo = gerarCodigo(prefix);
      }
      codigos.push(codigo);
    }

    await db.couponPack.create({
      data: {
        buyer_id: user.id,
        company_id: company.id,
        quantity: qtdCupons,
        type: "ANNUAL",
        assigned_to: profile!.id,
        assigned_at: new Date(),
        notes: `Compra Hotmart - ${isPack ? "Pack 10" : "Individual"} - ${email}`,
        coupons: {
          create: codigos.map((code) => ({ code })),
        },
      },
    });

    // Email de boas-vindas para o comprador (somente quando conta foi criada agora)
    if (isNewUser) {
      try {
        await sendEmail({
          to: email,
          subject: "Seu acesso à Atlântica Natural está pronto! 🌿",
          html: boasVindasTemplate({
            nome,
            email,
            senha,
            painelUrl: "https://atlantica.lojah.app/painel",
          }),
        });
      } catch (err) {
        console.error("Erro ao enviar email de boas-vindas:", err);
      }
    }

    // Email de aviso de nova compra para o admin
    try {
      await sendEmail({
        to: "rodolfogasparian@gmail.com",
        subject: "Nova compra recebida — Atlântica Natural",
        html: novaCompraTemplate({
          nome,
          email,
          plano: isPack ? "Pack 10 consultores" : "Plano Individual",
          data: new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
      });
    } catch (err) {
      console.error("Erro ao enviar email de aviso ao admin:", err);
    }

    console.log(`✅ Hotmart webhook processado: ${email} | ${qtdCupons} cupons | senha: ${senha}`);

    return NextResponse.json({ ok: true, email, cupons: qtdCupons });
  } catch (err) {
    console.error("Erro webhook Hotmart:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
