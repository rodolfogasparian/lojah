import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 });
const db = new PrismaClient({ adapter });

const BASE_IMG = "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/";

async function main() {
  // PASSO 1 — buscar company
  const company = await db.company.findUnique({ where: { slug: "atlantica" } });
  if (!company) throw new Error("Company 'atlantica' não encontrada");
  console.log("✅ company_id:", company.id);

  // PASSO 2 — buscar categoria Suplementos e Nutracêuticos
  const categoria = await db.productCategory.findFirst({
    where: { company_id: company.id, name: "Suplementos e Nutracêuticos" },
  });
  if (!categoria) throw new Error("Categoria 'Suplementos e Nutracêuticos' não encontrada");
  console.log("✅ categoria_id:", categoria.id, "| name:", categoria.name);

  // PASSO 3 — atualizar "Suco Aloe Vera 500ml" → "Aloe Vera Sabor Abacaxi"
  const imgAbacaxi = `${BASE_IMG}aloe-vera-sabor-abacaxi-500ml.png`;
  const resultadoUpdate = await db.product.updateMany({
    where: { company_id: company.id, name: "Suco Aloe Vera 500ml" },
    data: {
      name: "Aloe Vera Sabor Abacaxi",
      description:
        "Suco de aloe vera sabor abacaxi, bebida funcional com proposta antioxidante, suporte ao sistema imunológico e auxílio na regeneração da pele.",
      image_url: imgAbacaxi,
      catalog_image_url: imgAbacaxi,
    },
  });
  if (resultadoUpdate.count === 0) {
    console.warn("⚠️  Produto 'Suco Aloe Vera 500ml' não encontrado — verifique o nome exato no banco");
  } else {
    console.log(`✅ Produto atualizado: "Suco Aloe Vera 500ml" → "Aloe Vera Sabor Abacaxi" (${resultadoUpdate.count} registro)`);
  }

  // PASSO 4 — criar "Aloe Vita Suco" se ainda não existir
  const jaExiste = await db.product.findFirst({
    where: { company_id: company.id, name: "Aloe Vita Suco" },
  });

  if (jaExiste) {
    console.log("ℹ️  Produto 'Aloe Vita Suco' já existe — pulando criação");
  } else {
    const imgVita = `${BASE_IMG}aloe-vita-suco-1l.png`;
    const novo = await db.product.create({
      data: {
        company_id: company.id,
        category_id: categoria.id,
        code: "ALOE-VITA-001",
        name: "Aloe Vita Suco",
        description:
          "Aloe Vita, alimento funcional com Aloe Vera, indicado para suporte intestinal, ação antioxidante, alcaliniza o sangue, desintoxica as células e auxilia na cicatrização. Zero glúten, zero lactose, 99,7% aloe vera.",
        price_client: 170.0,
        image_url: imgVita,
        catalog_image_url: imgVita,
        active: true,
        sort_order: 0,
      },
    });
    console.log(`✅ Produto criado: "${novo.name}" | id: ${novo.id}`);
  }

  // PASSO 5 — confirmar os 3 produtos aloe no banco
  console.log("\n📋 Produtos 'aloe' no banco após execução:");
  const aloes = await db.product.findMany({
    where: {
      company_id: company.id,
      name: { contains: "Aloe", mode: "insensitive" },
    },
    select: { name: true, price_client: true, catalog_image_url: true, image_url: true },
    orderBy: { name: "asc" },
  });
  for (const p of aloes) {
    console.log(`  • ${p.name} | R$${p.price_client} | imagem: ${p.catalog_image_url ?? p.image_url ?? "(sem imagem)"}`);
  }

  await db.$disconnect();
}

main().catch((e) => {
  console.error("❌ Erro:", e.message ?? e);
  process.exit(1);
});
