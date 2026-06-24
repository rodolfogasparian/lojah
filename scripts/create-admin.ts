import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter } as any);

async function main() {
  const company = await db.company.findFirst({ where: { slug: "atlantica" } });
  if (!company) throw new Error("Empresa atlantica não encontrada");

  const hash = await bcrypt.hash("admin@2026", 10);

  const user = await db.user.upsert({
    where: { email: "rodolfogasparian@gmail.com" },
    update: { password_hash: hash, role: "COMPANY_ADMIN", company_id: company.id },
    create: {
      email: "rodolfogasparian@gmail.com",
      password_hash: hash,
      role: "COMPANY_ADMIN",
      company_id: company.id,
    },
  });

  console.log("Admin criado:", user.email, user.role);
  await db.$disconnect();
}

main().catch(console.error);
