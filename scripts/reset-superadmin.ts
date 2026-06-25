import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const user = await db.user.findUnique({ where: { email: "admin@lojah.app" } });

  if (!user) {
    console.log("Usuário não encontrado");
    return;
  }

  const password_hash = await hash("admin123", 10);

  await db.user.update({
    where: { email: "admin@lojah.app" },
    data: { password_hash },
  });

  console.log("Superadmin atualizado com sucesso");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
