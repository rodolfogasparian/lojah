import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 }) });

db.productCategory.update({
  where: { id: "e7ac34ac-fb94-4a15-babc-12976e562322" },
  data: { sort_order: 999 },
}).then((r) => {
  console.log("✅ sort_order atualizado para:", r.sort_order, "| categoria:", r.name);
  return db.$disconnect();
}).catch((e) => { console.error("❌", e.message); process.exit(1); });
