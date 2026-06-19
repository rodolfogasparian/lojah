import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
