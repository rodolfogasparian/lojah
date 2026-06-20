import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const FEMININOS = [
  "angeli", "crazy love", "fantastic", "esplendida", "la bella",
  "euphoria", "cloes", "fama", "very summer", "gabby",
  "521 hera vip", "giro woman", "521 rose", "idoll",
  "luxuria", "amore", "madeleine", "venus", "miss charm"
];

const MASCULINOS = [
  "521 vip black", "fortune", "scent", "rouge",
  "521 number men", "521 vip men", "aqua for men", "black private",
  "blackout silver", "champion", "dark bloom", "invictus",
  "indomavel", "khalifa", "phamous", "play men",
  "polo club", "racing car", "the boss", "zeus"
];

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function main() {
  const products = await prisma.product.findMany({
    where: { company: { slug: "atlantica" }, category: { name: { contains: "15" } } },
    include: { category: true },
  });

  console.log(`📦 ${products.length} perfumes 15ml encontrados`);

  let femCount = 0;
  let mascCount = 0;
  const noMatch: string[] = [];

  for (const product of products) {
    const nameLower = normalize(product.name);

    const isFem = FEMININOS.some((f) => nameLower.includes(normalize(f)));
    const isMasc = MASCULINOS.some((m) => nameLower.includes(normalize(m)));

    if (isFem) {
      // catalog_page_file (não catalog_image_url) -- guarda só o nome do
      // arquivo da página do catálogo impresso, usado no modal "Ver no
      // catálogo". catalog_image_url continua intacto, com a foto real do
      // produto usada na vitrine.
      await prisma.product.update({
        where: { id: product.id },
        data: { catalog_page_file: "perfumes-femininos-15ml.jpg" },
      });
      console.log(`✅ FEMININO: ${product.name}`);
      femCount++;
    } else if (isMasc) {
      await prisma.product.update({
        where: { id: product.id },
        data: { catalog_page_file: "perfumes-masculinos-15ml.jpg" },
      });
      console.log(`✅ MASCULINO: ${product.name}`);
      mascCount++;
    } else {
      noMatch.push(product.name);
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`✅ ${femCount} femininos vinculados`);
  console.log(`✅ ${mascCount} masculinos vinculados`);
  if (noMatch.length > 0) {
    console.log(`\n⚠️ Sem match (${noMatch.length}):`);
    noMatch.forEach((n) => console.log(`   - ${n}`));
  }

  await prisma.$disconnect();
}

main();
