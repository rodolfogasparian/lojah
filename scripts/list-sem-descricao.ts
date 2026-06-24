import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter } as any);

async function main() {
  const produtos = await db.product.findMany({
    where: { description: null },
    select: { name: true },
    orderBy: { name: "asc" },
  });

  console.log(`Total sem descrição: ${produtos.length}\n`);
  produtos.forEach(p => console.log(p.name));

  await db.$disconnect();
  await pool.end();
}

main().catch(console.error);
