import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 });
const db = new PrismaClient({ adapter });

async function main() {
  // PASSO 1 — buscar company
  const company = await db.company.findUnique({ where: { slug: "atlantica" } });
  if (!company) throw new Error("Company 'atlantica' não encontrada");
  console.log("✅ company_id:", company.id);

  // PASSO 2 — criar 2 novas categorias
  const telemedicina = await db.productCategory.create({
    data: { company_id: company.id, name: "Telemedicina", sort_order: 100 },
  });
  console.log("✅ Categoria criada:", telemedicina.name, "| id:", telemedicina.id);

  const telefonia = await db.productCategory.create({
    data: { company_id: company.id, name: "Telefonia", sort_order: 101 },
  });
  console.log("✅ Categoria criada:", telefonia.name, "| id:", telefonia.id);

  // PASSO 3 — mover produtos para Telemedicina
  const nomesTelemedicina = [
    "ATL Saúde PRO — 1 Vida",
    "ATL Saúde PRO — 4 Vidas",
    "ATL Saúde START — 1 Vida",
    "ATL Saúde START — 4 Vidas",
  ];

  let movidosTelemedicina = 0;
  for (const nome of nomesTelemedicina) {
    const resultado = await db.product.updateMany({
      where: { company_id: company.id, name: nome },
      data: { category_id: telemedicina.id },
    });
    console.log(`  ✅ Telemedicina ← ${nome} (${resultado.count} registro)`);
    movidosTelemedicina += resultado.count;
  }

  // PASSO 4 — mover produtos para Telefonia
  const telefoniaNames = [
    "ATL NEX — Chip",
    "ATL NEX — E-SIM",
    "ATL NEX Start — 14GB",
    "ATL NEX Start — 17GB",
    "ATL NEX Start — 22GB",
    "ATL NEX Turbo — 38GB",
    "ATL NEX Turbo — 58GB",
    "ATL NEX Turbo — 68GB",
  ];

  let movidosTelefonia = 0;
  for (const nome of telefoniaNames) {
    const resultado = await db.product.updateMany({
      where: { company_id: company.id, name: nome },
      data: { category_id: telefonia.id },
    });
    console.log(`  ✅ Telefonia ← ${nome} (${resultado.count} registro)`);
    movidosTelefonia += resultado.count;
  }

  console.log(`\n🎉 Concluído!`);
  console.log(`   Telemedicina: ${movidosTelemedicina} produto(s) movido(s)`);
  console.log(`   Telefonia:    ${movidosTelefonia} produto(s) movido(s)`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error("❌ Erro:", e.message ?? e);
  process.exit(1);
});
