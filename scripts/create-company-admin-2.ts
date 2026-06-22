import "dotenv/config";
import { db } from "../lib/db";
import { hashPassword } from "../lib/auth";

async function main() {
  const company = await db.company.findUnique({ where: { slug: "atlantica" } });
  if (!company) throw new Error("Empresa atlantica não encontrada");

  const hash = await hashPassword("atlantica@2026");

  // Remover admin anterior se existir
  await db.user.deleteMany({ where: { email: "admin@atlanticanatural.com" } });

  const user = await db.user.create({
    data: {
      email: "rodolfogasparian@gmail.com",
      password_hash: hash,
      role: "COMPANY_ADMIN",
      company_id: company.id,
    },
  });

  console.log("✅ Company Admin criado:", user.email);
  await db.$disconnect();
}

main();
