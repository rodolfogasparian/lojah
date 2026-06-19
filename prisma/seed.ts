import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const ATLANTICA_CATEGORIES = [
  "Linha Ozonizada",
  "Suplementos e Nutracêuticos",
  "Vitaminas",
  "Emagrecimento",
  "Óleos Essenciais",
  "Linha Academia",
  "Cosméticos Ozonizados",
  "Maquiagens",
  "Linha Facial",
  "Perfumes Bortoletto 15ml",
  "Perfumes Bortoletto 100ml",
  "Eau de Parfum ATL",
  "Novos Lançamentos",
];

const ATLANTICA_PRODUCTS: {
  code: string;
  name: string;
  priceConsultant: string;
  priceClient: string;
  category: string;
}[] = [
  { code: "0043", name: "Natuoz - Óleo Ozonizado 20ml", priceConsultant: "44.99", priceClient: "89.98", category: "Linha Ozonizada" },
  { code: "067", name: "Natuoz Family - Óleo Ozonizado 50ml", priceConsultant: "84.99", priceClient: "169.98", category: "Linha Ozonizada" },
  { code: "083", name: "Natuoz Hot - Ozonizado", priceConsultant: "65.99", priceClient: "131.98", category: "Linha Ozonizada" },
  { code: "084", name: "Natuoz Bucal - Ozonizado", priceConsultant: "65.99", priceClient: "131.98", category: "Linha Ozonizada" },
  { code: "102", name: "Natuoz Power - Ozonizado", priceConsultant: "65.99", priceClient: "131.98", category: "Linha Ozonizada" },
  { code: "103", name: "Natuoz Hialurônico - Ozonizado", priceConsultant: "65.99", priceClient: "131.98", category: "Linha Ozonizada" },
  { code: "118", name: "Natuoz Corpo - Ozonizado", priceConsultant: "65.99", priceClient: "131.98", category: "Linha Ozonizada" },
  { code: "119", name: "Natuoz Bronze - Ozonizado", priceConsultant: "65.99", priceClient: "131.98", category: "Linha Ozonizada" },
  { code: "197", name: "Natuoz Fios - Ozonizado", priceConsultant: "65.99", priceClient: "131.98", category: "Linha Ozonizada" },
  { code: "570", name: "Natuoz Óleo Íntimo", priceConsultant: "65.99", priceClient: "131.98", category: "Linha Ozonizada" },
  { code: "972", name: "Natuoz Pés e Pernas", priceConsultant: "65.99", priceClient: "131.98", category: "Linha Ozonizada" },
  { code: "792", name: "Rosa Mosqueta 30ml", priceConsultant: "34.99", priceClient: "69.98", category: "Linha Ozonizada" },
  { code: "375", name: "Natucap Ozonizado 60 Cáps", priceConsultant: "87.89", priceClient: "175.78", category: "Linha Ozonizada" },
  { code: "201", name: "Dermo - Máscara Argila Ozonizado", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Ozonizada" },
  { code: "202", name: "Dermo - Água Micelar Ozonizado", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Ozonizada" },
  { code: "203", name: "Dermo - Sabonete Facial Ozonizado", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Ozonizada" },
  { code: "204", name: "Dermo - Peeling de Cristal Ozonizado", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Ozonizada" },
  { code: "205", name: "Dermo - Creme Rosto Hidratante Ozonizado", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Ozonizada" },
  { code: "143", name: "Melatonina 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Suplementos e Nutracêuticos" },
  { code: "106", name: "L-Triptofano 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Suplementos e Nutracêuticos" },
  { code: "228", name: "Curcu Mais 30ml", priceConsultant: "59.99", priceClient: "119.98", category: "Suplementos e Nutracêuticos" },
  { code: "267", name: "Life Control 35ml", priceConsultant: "89.99", priceClient: "179.98", category: "Suplementos e Nutracêuticos" },
  { code: "369", name: "ATL Vision 30ml", priceConsultant: "59.99", priceClient: "119.98", category: "Suplementos e Nutracêuticos" },
  { code: "374", name: "Suco Aloe Vera 500ml", priceConsultant: "69.99", priceClient: "139.98", category: "Suplementos e Nutracêuticos" },
  { code: "372", name: "Vital Life 500ml", priceConsultant: "76.99", priceClient: "153.98", category: "Suplementos e Nutracêuticos" },
  { code: "0035", name: "Espirulina 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Suplementos e Nutracêuticos" },
  { code: "0014", name: "Fibras Complex 90 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Suplementos e Nutracêuticos" },
  { code: "0006", name: "Cart Control 60 Cáps", priceConsultant: "89.99", priceClient: "179.98", category: "Suplementos e Nutracêuticos" },
  { code: "187", name: "Coenzima Q10 60 Cáps", priceConsultant: "89.90", priceClient: "179.80", category: "Suplementos e Nutracêuticos" },
  { code: "0012", name: "A-Z Complex Mulher 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Vitaminas" },
  { code: "0013", name: "A-Z Complex Multi 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Vitaminas" },
  { code: "0015", name: "Essencial Beauty 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Vitaminas" },
  { code: "360", name: "Biotina Mastigável 60 Comp", priceConsultant: "59.99", priceClient: "119.98", category: "Vitaminas" },
  { code: "367", name: "Complexo B 60 Comp", priceConsultant: "59.99", priceClient: "119.98", category: "Vitaminas" },
  { code: "0018", name: "Cloreto de Magnésio 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Vitaminas" },
  { code: "189", name: "Chlorella 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Vitaminas" },
  { code: "370", name: "Mais Leve Comprimidos 120 Comp", priceConsultant: "76.89", priceClient: "153.78", category: "Emagrecimento" },
  { code: "364", name: "Ora Pro Nóbis 200g", priceConsultant: "82.39", priceClient: "164.78", category: "Emagrecimento" },
  { code: "182", name: "BCAA 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Linha Academia" },
  { code: "181", name: "ZMA 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Linha Academia" },
  { code: "183", name: "Picolinato de Cromo 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Linha Academia" },
  { code: "190", name: "Eleva Day 60 Cáps", priceConsultant: "59.99", priceClient: "119.98", category: "Linha Academia" },
  { code: "551", name: "Sérum Vitamina C 18ml", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Facial" },
  { code: "552", name: "Sérum Colágeno 18ml", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Facial" },
  { code: "553", name: "Sérum Niacinamida 18ml", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Facial" },
  { code: "554", name: "Sérum Hialurônico 18ml", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Facial" },
  { code: "555", name: "Água Termal 120ml", priceConsultant: "54.99", priceClient: "109.98", category: "Linha Facial" },
  { code: "556", name: "Esfoliante Corporal 250ml", priceConsultant: "54.99", priceClient: "109.98", category: "Cosméticos Ozonizados" },
  { code: "557", name: "Balm Modelador 18ml", priceConsultant: "54.99", priceClient: "109.98", category: "Cosméticos Ozonizados" },
  { code: "559", name: "Gel Redutor 250ml", priceConsultant: "65.89", priceClient: "131.78", category: "Cosméticos Ozonizados" },
  { code: "560", name: "Gel Relaxante 250ml", priceConsultant: "65.89", priceClient: "131.78", category: "Cosméticos Ozonizados" },
  { code: "561", name: "Protetor Solar Corporal FPS30 180ml", priceConsultant: "82.49", priceClient: "164.98", category: "Cosméticos Ozonizados" },
  { code: "562", name: "Protetor Solar Facial FPS60 60ml", priceConsultant: "87.89", priceClient: "175.78", category: "Linha Facial" },
  { code: "136", name: "Kit Shampoo + Condicionador", priceConsultant: "71.39", priceClient: "142.78", category: "Cosméticos Ozonizados" },
];

async function main() {
  const company = await db.company.upsert({
    where: { slug: "atlantica" },
    update: {},
    create: { slug: "atlantica", name: "Atlântica" },
  });

  const password_hash = await hash("admin123", 10);

  await db.user.upsert({
    where: { email: "admin@lojah.app" },
    update: {},
    create: {
      email: "admin@lojah.app",
      password_hash,
      role: "SUPERADMIN",
    },
  });

  console.log(`Empresa "${company.name}" (slug: ${company.slug}) pronta.`);
  console.log("Usuário superadmin admin@lojah.app pronto.");

  // Remove qualquer vendedor de teste antigo com slug "brunocaio"
  const staleSellers = await db.sellerProfile.findMany({
    where: { slug: "brunocaio" },
  });

  for (const stale of staleSellers) {
    await db.subscription.deleteMany({ where: { seller_id: stale.id } });
    await db.coupon.updateMany({
      where: { used_by: stale.id },
      data: { used_by: null, used_at: null },
    });
    await db.sellerProfile.delete({ where: { id: stale.id } });
    await db.user.delete({ where: { id: stale.user_id } });
    console.log(`Vendedor de teste "brunocaio" (${stale.id}) removido.`);
  }

  // Vendedor: Rodolfo Gasparian (slug "mentoriar"), na empresa Atlântica
  const sellerPasswordHash = await hash("senha123", 10);

  const sellerUser = await db.user.upsert({
    where: { email: "renda10online@gmail.com" },
    update: {
      role: "SELLER",
      company_id: company.id,
      password_hash: sellerPasswordHash,
    },
    create: {
      email: "renda10online@gmail.com",
      role: "SELLER",
      company_id: company.id,
      password_hash: sellerPasswordHash,
    },
  });

  const sellerProfile = await db.sellerProfile.upsert({
    where: { user_id: sellerUser.id },
    update: {
      company_id: company.id,
      slug: "mentoriar",
      name: "Rodolfo Gasparian",
    },
    create: {
      user_id: sellerUser.id,
      company_id: company.id,
      slug: "mentoriar",
      name: "Rodolfo Gasparian",
    },
  });

  const activatedAt = new Date();
  const expiresAt = new Date(activatedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Subscription não tem chave única em seller_id, então o "upsert" é manual:
  // atualiza a assinatura ativa existente, ou cria uma nova.
  const existingSubscription = await db.subscription.findFirst({
    where: { seller_id: sellerProfile.id, status: "ACTIVE" },
  });

  if (existingSubscription) {
    await db.subscription.update({
      where: { id: existingSubscription.id },
      data: { status: "ACTIVE", activated_at: activatedAt, expires_at: expiresAt },
    });
  } else {
    await db.subscription.create({
      data: {
        seller_id: sellerProfile.id,
        status: "ACTIVE",
        activated_at: activatedAt,
        expires_at: expiresAt,
      },
    });
  }

  console.log(
    `Vendedor "${sellerProfile.name}" (slug: ${sellerProfile.slug}) pronto, com assinatura ativa até ${expiresAt.toLocaleDateString("pt-BR")}.`
  );

  // Catálogo da Atlântica Natural: categorias e produtos
  const categoryIdByName = new Map<string, string>();

  for (const [index, name] of ATLANTICA_CATEGORIES.entries()) {
    const category = await db.productCategory.upsert({
      where: { company_id_name: { company_id: company.id, name } },
      update: { sort_order: index },
      create: { company_id: company.id, name, sort_order: index },
    });
    categoryIdByName.set(name, category.id);
  }

  for (const [index, product] of ATLANTICA_PRODUCTS.entries()) {
    const categoryId = categoryIdByName.get(product.category);
    if (!categoryId) {
      throw new Error(
        `Categoria "${product.category}" não encontrada para o produto ${product.code}.`
      );
    }

    await db.product.upsert({
      where: { company_id_code: { company_id: company.id, code: product.code } },
      update: {
        category_id: categoryId,
        name: product.name,
        price_consultant: product.priceConsultant,
        price_client: product.priceClient,
        active: true,
        sort_order: index,
      },
      create: {
        company_id: company.id,
        category_id: categoryId,
        code: product.code,
        name: product.name,
        description: null,
        price_consultant: product.priceConsultant,
        price_client: product.priceClient,
        image_url: null,
        active: true,
        sort_order: index,
      },
    });
  }

  console.log(
    `${ATLANTICA_CATEGORIES.length} categorias e ${ATLANTICA_PRODUCTS.length} produtos da Atlântica Natural prontos.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
