import "dotenv/config";
import { db } from "../lib/db";

const MAPA: Array<{ page: number; nomes: string[] }> = [
  // Linha Ozonizada
  { page: 67,  nomes: ["natuoz family"] },
  { page: 87,  nomes: ["natuoz hialuronico", "natucap ozonizado"] },
  { page: 88,  nomes: ["natuoz oleo intimo", "natuoz intimo"] },
  { page: 154, nomes: ["natuoz pes e pernas", "natuoz oleo pes"] },
  { page: 153, nomes: ["creme dental ozonizado"] },
  { page: 152, nomes: ["desodorante ozonizado"] },
  { page: 151, nomes: ["sabonete banho ozonizado"] },

  // Cosméticos Ozonizados
  { page: 108, nomes: ["gel redutor 250"] },
  { page: 109, nomes: ["gel relaxante 250"] },
  { page: 125, nomes: ["hidratante encantada"] },
  { page: 126, nomes: ["hidratante radiante"] },
  { page: 127, nomes: ["hidratante sensual"] },

  // Emagrecimento
  { page: 35,  nomes: ["cafe fibras"] },
  { page: 50,  nomes: ["slim cha"] },
  { page: 22,  nomes: ["mais leve cha"] },
  { page: 23,  nomes: ["mais leve comprimidos"] },
  { page: 46,  nomes: ["detox"] },
  { page: 36,  nomes: ["green caps", "green"] },

  // Linha Academia
  { page: 54,  nomes: ["creatina"] },
  { page: 56,  nomes: ["cafe pre treino", "pre treino cafe"] },
  { page: 158, nomes: ["mastigavel creatina", "creatina mastigavel"] },

  // Vitaminas
  { page: 137, nomes: ["gotas adek"] },
  { page: 30,  nomes: ["gotas de vitamina d"] },
  { page: 132, nomes: ["gotas vitamina b9"] },
  { page: 130, nomes: ["gotas zinco"] },
  { page: 39,  nomes: ["imuni kids"] },
  { page: 102, nomes: ["imunic vitamina c gotas", "imunic gotas"] },
  { page: 17,  nomes: ["imunipro"] },
  { page: 114, nomes: ["ost calcio"] },
  { page: 29,  nomes: ["vitamina d3 2000", "vitamina d3 mastigavel", "vitamina d3 capsulas"] },
  { page: 31,  nomes: ["vitamina d3+mk7", "vitamina k2 gotas", "k2mk7"] },
  { page: 44,  nomes: ["zinco"] },

  // Suplementos
  { page: 6,   nomes: ["colageno anti age"] },
  { page: 7,   nomes: ["colageno hialuronico"] },
  { page: 8,   nomes: ["curcu mais"] },

  // Perfumes 100ml — reaproveita as mesmas imagens dos 15ml (não existe
  // asset dedicado a 100ml no bucket catalog-pages)
  // Femininos
  { page: -1,  nomes: ["angeli 100", "crazy love 100", "fantastic 100", "esplendida 100",
                        "la bella 100", "euphoria 100", "cloes 100", "fama 100",
                        "very summer 100", "gabby 100", "521 hera vip 100", "giro woman 100",
                        "521 rose 100", "idoll 100", "luxuria 100", "amore 100",
                        "madeleine 100", "venus 100", "miss charm 100"] },
  // Masculinos
  { page: -2,  nomes: ["521 vip black 100", "fortune 100", "scent 100", "rouge 100",
                        "521 number men 100", "521 vip men 100", "aqua for men 100",
                        "black privat 100", "blackout silver 100", "champion 100",
                        "dark bloom 100", "invictus 100", "indomavel 100", "khalifa 100",
                        "phamous 100", "play men 100", "polo club 100", "racing car 100",
                        "the boss 100", "zeus 100"] },
];

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getFile(page: number): string {
  if (page === -1) return "perfumes-femininos-15ml.jpg";
  // Nome real do arquivo no bucket tem hífen: "15-ml", não "15ml".
  if (page === -2) return "perfumes-masculinos-15-ml.jpg";
  return `${page}.jpg`;
}

async function main() {
  const products = await db.product.findMany({
    where: { company: { slug: "atlantica" }, catalog_page_file: null },
  });

  console.log(`📦 ${products.length} produtos sem catalog_page_file`);
  let updated = 0;
  const noMatch: string[] = [];

  for (const { page, nomes } of MAPA) {
    const matched = products.filter((p) =>
      nomes.some((n) => normalize(p.name).includes(normalize(n)))
    );
    if (matched.length === 0) {
      noMatch.push(`página ${page}: [${nomes.join(", ")}]`);
      continue;
    }
    for (const p of matched) {
      await db.product.update({
        where: { id: p.id },
        data: { catalog_page_file: getFile(page) },
      });
      console.log(`✅ ${getFile(page)} → ${p.name}`);
      updated++;
    }
  }

  console.log(`\n📊 ${updated} produtos vinculados`);
  if (noMatch.length) {
    console.log(`⚠️  Sem match:`);
    noMatch.forEach((m) => console.log(`   ${m}`));
  }

  await db.$disconnect();
}

main();
