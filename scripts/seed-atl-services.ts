import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 });
const db = new PrismaClient({ adapter });

const BASE_IMG = "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/";

async function main() {
  // PASSO 1 — buscar company
  const company = await db.company.findUnique({ where: { slug: "atlantica" } });
  if (!company) throw new Error("Company 'atlantica' não encontrada");
  console.log("✅ company_id:", company.id);

  // PASSO 2 — criar categoria
  const categoria = await db.productCategory.create({
    data: {
      company_id: company.id,
      name: "ATL Services",
      sort_order: 99,
    },
  });
  console.log("✅ categoria criada — id:", categoria.id, "| name:", categoria.name);

  // PASSO 3 — criar produtos
  const produtos = [
    {
      code: "ATL-SVC-001",
      name: "ATL Saúde PRO — 1 Vida",
      description: "Telemedicina, clube de desconto em medicamentos e muito mais. O cuidado que você merece por R$ 44,99/mês.",
      price: 44.99,
      image_url: `${BASE_IMG}s-pro-1-vida.jpg`,
      catalog_page_file: "s-onmed-pro-1-vida.jpg",
      sort_order: 1,
    },
    {
      code: "ATL-SVC-002",
      name: "ATL Saúde PRO — 4 Vidas",
      description: "Proteja toda sua família com telemedicina ilimitada, psicólogo, clube de benefícios e desconto em medicamentos. 4 vidas por apenas R$ 99,99/mês.",
      price: 99.99,
      image_url: `${BASE_IMG}s-pro-4-vidas.jpg`,
      catalog_page_file: "s-onmed-pro-4-vidas.jpg",
      sort_order: 2,
    },
    {
      code: "ATL-SVC-003",
      name: "ATL Saúde START — 1 Vida",
      description: "Plano inicial de saúde com telemedicina e benefícios essenciais para você. R$ 29,99/mês.",
      price: 29.99,
      image_url: `${BASE_IMG}s-start-1-vida.jpg`,
      catalog_page_file: "s-onmed-start-1-vida.png",
      sort_order: 3,
    },
    {
      code: "ATL-SVC-004",
      name: "ATL Saúde START — 4 Vidas",
      description: "Plano inicial de saúde com telemedicina e benefícios essenciais para toda a família. R$ 69,99/mês.",
      price: 69.99,
      image_url: `${BASE_IMG}s-start-4vidas.jpg`,
      catalog_page_file: "s-onmed-start-4-vidas.jpg",
      sort_order: 4,
    },
    {
      code: "ATL-SVC-005",
      name: "Aura Link Pro",
      description: "15 inteligências artificiais conectadas em um só lugar. Automatize, escale e transforme seu negócio com tecnologia de ponta. Suporte 24/7.",
      price: 149.99,
      image_url: `${BASE_IMG}s-aura-link.jpeg`,
      catalog_page_file: "s-aura-link-pro.jpg",
      sort_order: 5,
    },
    {
      code: "ATL-SVC-006",
      name: "ATL TV",
      description: "177 canais ao vivo + mais de 1.000 filmes e séries. Assista onde e quando quiser, com qualidade premium e preço acessível.",
      price: 79.99,
      image_url: `${BASE_IMG}s-atl-tv.jpeg`,
      catalog_page_file: "s-atl-tv.jpeg",
      sort_order: 6,
    },
    {
      code: "ATL-SVC-007",
      name: "ATL Energy",
      description: "Ganhe até 15% de desconto na sua fatura de energia sem instalar placas solares. Você tem direito pela Lei 14.300/2022.",
      price: null,
      image_url: `${BASE_IMG}s-energia-economia.jpeg`,
      catalog_page_file: "s-desconto-energia.jpg",
      sort_order: 7,
    },
    {
      code: "ATL-SVC-008",
      name: "ATL NEX — Chip",
      description: "Chip de telefonia digital ATL NEX. Ative sua linha e ganhe comissão recorrente por cada cliente indicado.",
      price: 10.00,
      image_url: `${BASE_IMG}s-chip.jpg`,
      catalog_page_file: "s-chip.jpg",
      sort_order: 8,
    },
    {
      code: "ATL-SVC-009",
      name: "ATL NEX — E-SIM",
      description: "Chip digital sem necessidade de hardware físico. Ative direto no celular e ganhe comissão recorrente.",
      price: 10.00,
      image_url: `${BASE_IMG}s-esim.jpg`,
      catalog_page_file: "s-esim.jpg",
      sort_order: 9,
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
