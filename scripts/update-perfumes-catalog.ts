import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const FEMININOS_15ML = [
  "Fragrância Chanel Nº5 15ml",
  "Fragrância Angel 15ml",
  "Fragrância Fantasy 15ml",
  "Fragrância Olympea 15ml",
  "Fragrância Scandal 15ml",
  "Fragrância La Vie Est Belle 15ml",
  "Fragrância Euphoria 15ml",
  "Fragrância Chloé 15ml",
  "Fragrância Fame 15ml",
  "Fragrância Light Blue 15ml",
  "Fragrância Gabriela Sabatini 15ml",
  "Fragrância 212 VIP 15ml",
  "Fragrância Good Girl 15ml",
  "Fragrância 212 VIP Rosé 15ml",
  "Fragrância Idôle 15ml",
  "Fragrância La Nuit 15ml",
  "Fragrância J'adore 15ml",
  "Fragrância Coco Mademoiselle 15ml",
  "Fragrância CH 15ml",
  "Fragrância Miss Dior 15ml",
];

const MASCULINOS_15ML = [
  "Fragrância 212 VIP Black 15ml",
  "Fragrância One Million 15ml",
  "Fragrância CH Men 15ml",
  "Fragrância Baccarat 15ml",
  "Fragrância 212 Men 15ml",
  "Fragrância 212 VIP Men 15ml",
  "Fragrância Acqua di Gio 15ml",
  "Fragrância Armani Code 15ml",
  "Fragrância Silver Scent 15ml",
  "Fragrância Azzaro 15ml",
  "Fragrância Bleu de Chanel 15ml",
  "Fragrância Invictus 15ml",
  "Fragrância Sauvage 15ml",
  "Fragrância Animale 15ml",
  "Fragrância Phantom 15ml",
  "Fragrância Bad Boy 15ml",
  "Fragrância Pólo Blue 15ml",
  "Fragrância Ferrari Black 15ml",
  "Fragrância Hugo Boss 15ml",
  "Fragrância Pólo 15ml",
];

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function main() {
  const products = await prisma.product.findMany({
    where: { company: { slug: "atlantica" } },
    include: { category: true },
  });

  let updated = 0;

  for (const product of products) {
    const nameLower = normalize(product.name);

    const isFeminino = FEMININOS_15ML.some((f) => normalize(f) === nameLower);
    const isMasculino = MASCULINOS_15ML.some((m) => normalize(m) === nameLower);

    if (isFeminino) {
      // catalog_page_file (não catalog_image_url) -- esse campo guarda só o
      // nome do arquivo da página do catálogo impresso, usado no modal "Ver
      // no catálogo". catalog_image_url continua intacto, com a foto real
      // do produto usada na vitrine.
      await prisma.product.update({
        where: { id: product.id },
        data: { catalog_page_file: "perfumes-femininos-15ml.jpg" },
      });
      console.log(`✅ FEMININO: ${product.name}`);
      updated++;
    } else if (isMasculino) {
      await prisma.product.update({
        where: { id: product.id },
        data: { catalog_page_file: "perfumes-masculinos-15ml.jpg" },
      });
      console.log(`✅ MASCULINO: ${product.name}`);
      updated++;
    }
  }

  console.log(`\n✅ ${updated} perfumes atualizados`);
  await prisma.$disconnect();
}

main();
