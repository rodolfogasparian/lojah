import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 });
const db = new PrismaClient({ adapter });

const BASE_IMG = "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/";

async function main() {
  // PASSO 1 — buscar company e categoria
  const company = await db.company.findUnique({ where: { slug: "atlantica" } });
  if (!company) throw new Error("Company 'atlantica' não encontrada");
  console.log("✅ company_id:", company.id);

  const categoria = await db.productCategory.findFirst({
    where: { company_id: company.id, name: "ATL Services" },
  });
  if (!categoria) throw new Error("Categoria 'ATL Services' não encontrada");
  console.log("✅ categoria_id:", categoria.id, "| name:", categoria.name);

  // PASSO 2 — criar produtos
  const produtos = [
    {
      code: "ATL-NEX-001",
      name: "ATL NEX Start — 14GB",
      description: "Plano Start com 14GB (8GB + 6GB bônus). WhatsApp sem descontar da franquia, ligações ilimitadas, 60 SMS e 1GB de portabilidade. R$ 59,99/mês.",
      price: 59.99,
      image_url: `${BASE_IMG}s-start-14gb.png`,
      catalog_page_file: "s-start-14gb.png",
      sort_order: 10,
    },
    {
      code: "ATL-NEX-002",
      name: "ATL NEX Start — 17GB",
      description: "Plano Start com 17GB (14GB + 3GB bônus). WhatsApp sem descontar da franquia, ligações ilimitadas, 60 SMS e 1GB de portabilidade. R$ 69,99/mês.",
      price: 69.99,
      image_url: `${BASE_IMG}s-start-17gb.png`,
      catalog_page_file: "s-start-17gb.png",
      sort_order: 11,
    },
    {
      code: "ATL-NEX-003",
      name: "ATL NEX Start — 22GB",
      description: "Plano Start com 22GB (21GB + 1GB bônus). WhatsApp sem descontar da franquia, ligações limitadas, 60 SMS e 1GB de portabilidade. R$ 84,99/mês.",
      price: 84.99,
      image_url: `${BASE_IMG}s-start-22gb.png`,
      catalog_page_file: "s-start-22gb.png",
      sort_order: 12,
    },
    {
      code: "ATL-NEX-004",
      name: "ATL NEX Turbo — 38GB",
      description: "Plano Turbo com 38GB (29GB + 9GB bônus). WhatsApp sem descontar da franquia, ligações ilimitadas, 60 SMS e 1GB de portabilidade. R$ 109,99/mês.",
      price: 109.99,
      image_url: `${BASE_IMG}s-turbo-38gb.png`,
      catalog_page_file: "s-turbo-38gb.png",
      sort_order: 13,
    },
    {
      code: "ATL-NEX-005",
      name: "ATL NEX Turbo — 58GB",
      description: "Plano Turbo com 58GB (39GB + 19GB bônus). WhatsApp sem descontar da franquia, ligações ilimitadas, 60 SMS e 1GB de portabilidade. R$ 129,99/mês.",
      price: 129.99,
      image_url: `${BASE_IMG}s-turbo-58gb.png`,
      catalog_page_file: "s-turbo-58gb.png",
      sort_order: 14,
    },
    {
      code: "ATL-NEX-006",
      name: "ATL NEX Turbo — 68GB",
      description: "Plano Turbo com 68GB (44GB + 24GB bônus). WhatsApp sem descontar da franquia, ligações ilimitadas, 60 SMS e 1GB de portabilidade. R$ 149,99/mês.",
      price: 149.99,
      image_url: `${BASE_IMG}s-turbo-68gb.png`,
      catalog_page_file: "s-turbo-68gb.png",
      sort_order: 15,
    },
  ];

  let criados = 0;
  for (const p of produtos) {
    await db.product.create({
      data: {
        company_id: company.id,
        category_id: categoria.id,
        code: p.code,
        name: p.name,
        description: p.description,
        price_client: p.price,
        image_url: p.image_url,
        catalog_page_file: p.catalog_page_file,
        active: true,
        sort_order: p.sort_order,
      },
    });
    console.log(`  ✅ [${p.sort_order}] ${p.name}`);
    criados++;
  }

  console.log(`\n🎉 Concluído! ${criados} produto(s) inserido(s) na categoria "${categoria.name}".`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error("❌ Erro:", e.message ?? e);
  process.exit(1);
});
