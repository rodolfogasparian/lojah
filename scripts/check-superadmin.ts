import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const user = await db.user.findUnique({
    where: { email: "admin@lojah.app" },
  });

  if (!user) {
    console.log("Usuário não encontrado");
    return;
  }

  console.log("Usuário encontrado:");
  console.log("  role:          ", user.role);
  console.log("  password_hash: ", !!user.password_hash);
  console.log("  company_id:    ", user.company_id);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
