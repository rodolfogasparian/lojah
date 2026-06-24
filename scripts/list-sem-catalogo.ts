import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter } as any);

async function main() {
  // Produtos sem imagem de catálogo
  const semCatalogo = await db.product.findMany({
    where: {
      active: true,
      catalog_page_file: null,
      catalog_page: null,
    },
    select: { name: true, category: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  // Produtos inativos
  const inativos = await db.product.findMany({
    where: { active: false },
    select: { name: true },
    orderBy: { name: "asc" },
  });

  console.log(`\n=== PRODUTOS SEM IMAGEM DE CATÁLOGO (${semCatalogo.length}) ===`);
  semCatalogo.forEach(p => console.log(`  [${p.category?.name ?? "sem categoria"}] ${p.name}`));

  console.log(`\n=== PRODUTOS INATIVOS (${inativos.length}) ===`);
  inativos.forEach(p => console.log(`  ${p.name}`));

  await db.$disconnect();
  await pool.end();
}

main().catch(console.error);
