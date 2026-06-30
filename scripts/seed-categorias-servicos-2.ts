import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 });
const db = new PrismaClient({ adapter });

async function main() {
  // PASSO 1 — buscar company
  const company = await db.company.findUnique({ where: { slug: "atlantica" } });
  if (!company) throw new Error("Company 'atlantica' não encontrada");
  console.log("✅ company_id:", company.id);

  // PASSO 2 — criar 3 novas categorias
  const tv = await db.productCategory.create({
    data: { company_id: company.id, name: "TV", sort_order: 102 },
  });
  console.log("✅ Categoria criada:", tv.name, "| id:", tv.id);

  const ia = await db.productCategory.create({
    data: { company_id: company.id, name: "Inteligência Artificial", sort_order: 103 },
  });
  console.log("✅ Categoria criada:", ia.name, "| id:", ia.id);

  const energia = await db.productCategory.create({
    data: { company_id: company.id, name: "Energia", sort_order: 104 },
  });
  console.log("✅ Categoria criada:", energia.name, "| id:", energia.id);

  // PASSO 3 — mover produtos
  const movimentos: [string, string] = [] as unknown as [string, string];
  const tarefas: Array<{ nome: string; categoryId: string; label: string }> = [
    { nome: "ATL TV",              categoryId: tv.id,     label: "TV" },
    { nome: "Aura Link Pro",       categoryId: ia.id,     label: "Inteligência Artificial" },
    { nome: "ATL Energy",          categoryId: energia.id, label: "Energia" },
  ];

  let totalMovidos = 0;
  for (const tarefa of tarefas) {
    const resultado = await db.product.updateMany({
      where: { company_id: company.id, name: tarefa.nome },
      data: { category_id: tarefa.categoryId },
    });
    console.log(`  ✅ ${tarefa.label} ← "${tarefa.nome}" (${resultado.count} registro)`);
    totalMovidos += resultado.count;
  }

  console.log(`\n🎉 Concluído!`);
  console.log(`   Total: ${totalMovidos} produto(s) movido(s)`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error("❌ Erro:", e.message ?? e);
  process.exit(1);
});
