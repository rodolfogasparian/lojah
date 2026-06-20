import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // Cada instância de função serverless deve manter poucas conexões —
  // o pooler do Supabase (PgBouncer/Supavisor) já cuida do pooling real.
  // O parâmetro `connection_limit` na connection string é ignorado pelo
  // node-postgres, então o limite precisa ser configurado aqui.
  max: 1,
});

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
