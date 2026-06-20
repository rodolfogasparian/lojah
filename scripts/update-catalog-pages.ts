import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Mapeamento: página do guia → termos de busca no nome do produto
const PAGE_MAP: Array<{ page: number; terms: string[] }> = [
  { page: 1, terms: ["a-z complex mulher"] },
  { page: 2, terms: ["a-z complex multi"] },
  { page: 3, terms: ["cart control"] },
  { page: 4, terms: ["night chá", "night cha"] },
  { page: 5, terms: ["cloreto de magnésio", "cloreto de magnesio"] },
  { page: 6, terms: ["colágeno anti-age", "colageno anti-age"] },
  { page: 7, terms: ["colágeno com verisol", "colageno com verisol"] },
  { page: 8, terms: ["curcu mais gotas"] },
  { page: 9, terms: ["triptofano"] },
  { page: 10, terms: ["espirulina"] },
  { page: 11, terms: ["essencial beauty"] },
  { page: 12, terms: ["ômega 3", "omega 3"] },
  { page: 13, terms: ["aloe vera"] },
  { page: 14, terms: ["aloe vera suco"] },
  { page: 15, terms: ["geleia real"] },
  { page: 16, terms: ["imunic efervescente"] },
  { page: 17, terms: ["imuni pro"] },
  { page: 18, terms: ["maca peruana"] },
  { page: 19, terms: ["extrato de própolis", "extrato de propolis"] },
  { page: 20, terms: ["melatonina"] },
  { page: 21, terms: ["melatonina gummy"] },
  { page: 22, terms: ["mais leve solúvel", "mais leve soluvel"] },
  { page: 23, terms: ["mais leve cápsulas", "mais leve capsulas"] },
  { page: 24, terms: ["natuvitta"] },
  { page: 25, terms: ["óleo de abacate", "oleo de abacate"] },
  { page: 26, terms: ["ora pro nobis"] },
  { page: 27, terms: ["visionmax"] },
  { page: 28, terms: ["vital life"] },
  { page: 29, terms: ["vitamina d3 cápsulas", "vitamina d3 capsulas"] },
  { page: 30, terms: ["vitamina d3 gotas"] },
  { page: 31, terms: ["vitamina k2mk7", "k2mk7"] },
  { page: 32, terms: ["vitamina a"] },
  { page: 33, terms: ["vitamina b12"] },
  { page: 34, terms: ["bálsamo copaíba", "balsamo copaiba"] },
  { page: 35, terms: ["natural café fibras", "natural cafe fibras"] },
  { page: 36, terms: ["chlorella"] },
  { page: 37, terms: ["coenzima q10"] },
  { page: 38, terms: ["eleva day"] },
  { page: 39, terms: ["imuno kids"] },
  { page: 40, terms: ["resveratrol"] },
  { page: 41, terms: ["biotina mastigável", "biotina mastigavel"] },
  { page: 42, terms: ["gummy kids"] },
  { page: 43, terms: ["beauty gummy"] },
  { page: 44, terms: ["zinco max"] },
  { page: 45, terms: ["complexo b"] },
  { page: 46, terms: ["chá verde", "cha verde"] },
  { page: 47, terms: ["energy guaraná", "energy guarana"] },
  { page: 48, terms: ["fibras complex"] },
  { page: 49, terms: ["focuss"] },
  { page: 50, terms: ["slim chá sb", "slim cha sb"] },
  { page: 51, terms: ["thermo heat"] },
  { page: 52, terms: ["bcaa"] },
  { page: 53, terms: ["colostro bovino"] },
  { page: 54, terms: ["creatina monoidratada"] },
  { page: 55, terms: ["moro treiny"] },
  { page: 56, terms: ["natural pré-treino café", "natural pre-treino cafe", "pre-treino café"] },
  { page: 57, terms: ["picolinato de cromo"] },
  { page: 58, terms: ["zma"] },
  { page: 59, terms: ["natuoz creme"] },
  { page: 60, terms: ["sabonete íntimo", "sabonete intimo"] },
  { page: 61, terms: ["natuliso"] },
  { page: 62, terms: ["loção corporal", "locao corporal"] },
  { page: 63, terms: ["natuoz - óleo ozonizado 20ml", "natuoz oleo ozonizado 20", "natuoz óleo ozonizado 20"] },
  { page: 64, terms: ["natuoz bronze"] },
  { page: 65, terms: ["natuoz bucal"] },
  { page: 66, terms: ["natuoz corpo"] },
  { page: 67, terms: ["natuoz rosto"] },
  { page: 68, terms: ["natuoz hot"] },
  { page: 69, terms: ["natuoz power"] },
  { page: 70, terms: ["bb cream"] },
  { page: 71, terms: ["creme de pentear"] },
  { page: 72, terms: ["máscara capilar", "mascara capilar"] },
  { page: 73, terms: ["natuoz fios"] },
  { page: 74, terms: ["natuoz desodorante"] },
  { page: 75, terms: ["natuoz gel dental"] },
  { page: 76, terms: ["natuoz sabonete líquido", "natuoz sabonete liquido"] },
  { page: 77, terms: ["água micelar", "agua micelar"] },
  { page: 78, terms: ["creme hidratante"] },
  { page: 79, terms: ["máscara facial", "mascara facial"] },
  { page: 80, terms: ["peeling"] },
  { page: 81, terms: ["sabonete facial"] },
  { page: 82, terms: ["natuoz sh e cd", "natuoz sh", "natuoz cd"] },
  { page: 83, terms: ["hidra max fase 1"] },
  { page: 84, terms: ["hidra max fase 2"] },
  { page: 85, terms: ["alinhamento absoluto fase 1"] },
  { page: 86, terms: ["alinhamento absoluto fase 2"] },
  { page: 87, terms: ["natuoz ozonizado"] },
  { page: 88, terms: ["natuoz íntimo", "natuoz intimo"] },
  { page: 89, terms: ["oe laranja doce", "laranja doce"] },
  { page: 90, terms: ["oe limão siciliano", "limao siciliano", "limão siciliano"] },
  { page: 91, terms: ["oe menta"] },
  { page: 92, terms: ["oe melaleuca", "melaleuca"] },
  { page: 93, terms: ["oe lavanda", "lavanda"] },
  { page: 94, terms: ["oe gerânio", "oe geranio", "gerânio"] },
  { page: 95, terms: ["oe alecrim", "alecrim"] },
  { page: 96, terms: ["oe eucalipto", "eucalipto"] },
  { page: 97, terms: ["life control"] },
  { page: 98, terms: ["pulseira bioquântica", "pulseira bioquantica"] },
  { page: 99, terms: ["shake"] },
  { page: 101, terms: ["maiszen"] },
  { page: 102, terms: ["imunic gotas"] },
  { page: 103, terms: ["beijo bom"] },
  { page: 104, terms: ["perfume bortoletto"] },
  { page: 105, terms: ["água termal", "agua termal"] },
  { page: 106, terms: ["balm modelador"] },
  { page: 107, terms: ["mousse facial"] },
  { page: 108, terms: ["gel redutor corporal"] },
  { page: 109, terms: ["gel relaxante corporal"] },
  { page: 110, terms: ["natuliv"] },
  { page: 111, terms: ["avant"] },
  { page: 112, terms: ["inspire"] },
  { page: 113, terms: ["5 magnésios", "5 magnesios"] },
  { page: 114, terms: ["ostcálcio", "ostcalcio"] },
  { page: 115, terms: ["melatonina gotas"] },
  { page: 116, terms: ["amargo"] },
  { page: 117, terms: ["ferro"] },
  { page: 118, terms: ["mind expert"] },
  { page: 119, terms: ["carvão ativado", "carvao ativado"] },
  { page: 120, terms: ["menta doce"] },
  { page: 121, terms: ["shampoo hidratante"] },
  { page: 122, terms: ["condicionador hidratante"] },
  { page: 123, terms: ["linha men 4 em 1", "men 4 em 1"] },
  { page: 125, terms: ["hidratante corporal encantada"] },
  { page: 126, terms: ["hidratante corporal radiante"] },
  { page: 127, terms: ["hidratante corporal sensual"] },
  { page: 128, terms: ["rosa mosqueta"] },
  { page: 129, terms: ["gel de massagem extra forte"] },
  { page: 130, terms: ["zinco em gotas"] },
  { page: 131, terms: ["magnésio dimalato", "magnesio dimalato"] },
  { page: 132, terms: ["vitamina b9 em gotas", "b9 em gotas"] },
  { page: 133, terms: ["melatonina mastigáveis", "melatonina mastigaveis"] },
  { page: 134, terms: ["castanha da índia", "castanha da india"] },
  { page: 135, terms: ["centella asiática", "centella asiatica"] },
  { page: 136, terms: ["unha de gato"] },
  { page: 137, terms: ["adek gotas"] },
  { page: 138, terms: ["lisina gotas"] },
  { page: 139, terms: ["spray cromo ctrl"] },
  { page: 140, terms: ["spray de própolis", "spray de propolis"] },
  { page: 141, terms: ["ampola crono power nutrição", "crono power nutricao", "crono power nutrição"] },
  { page: 142, terms: ["ampola crono power reconstrução", "crono power reconstrucao", "crono power reconstrução"] },
  { page: 143, terms: ["óleo finalizador", "oleo finalizador"] },
  { page: 144, terms: ["protetor térmico", "protetor termico"] },
  { page: 145, terms: ["ativador de cachos"] },
  { page: 146, terms: ["shampoo gold hydration"] },
  { page: 147, terms: ["condicionador gold hydration"] },
  { page: 148, terms: ["máscara gold hydration", "mascara gold hydration"] },
  { page: 149, terms: ["condicionador infantil"] },
  { page: 150, terms: ["shampoo infantil"] },
  { page: 151, terms: ["sabonete de banho"] },
  { page: 152, terms: ["desodorante em creme"] },
  { page: 153, terms: ["natuoz creme dental"] },
  { page: 154, terms: ["natuoz óleo pés e pernas", "natuoz oleo pes e pernas"] },
  { page: 155, terms: ["hidratante para os pés", "hidratante para os pes"] },
  { page: 156, terms: ["sabonete antiacne"] },
  { page: 157, terms: ["nanoxenol"] },
  { page: 158, terms: ["creatina mastigável", "creatina mastigavel"] },
];

async function main() {
  console.log("🔍 Buscando todos os produtos da Atlântica...");
  const products = await prisma.product.findMany({
    include: { company: { select: { slug: true } } },
    where: { company: { slug: "atlantica" } },
  });
  console.log(`📦 ${products.length} produtos encontrados`);

  let updated = 0;
  const notFound: string[] = [];

  for (const { page, terms } of PAGE_MAP) {
    const matched = products.filter((p) => {
      const nameLower = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return terms.some((term) => {
        const termNorm = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return nameLower.includes(termNorm);
      });
    });

    if (matched.length === 0) {
      notFound.push(`Página ${page}: nenhum produto encontrado para [${terms.join(", ")}]`);
      continue;
    }

    for (const product of matched) {
      // Só grava catalog_page (número da página). catalog_image_url NÃO é
      // tocado aqui -- esse campo já guarda a foto real do produto, usada
      // na vitrine, e não pode ser sobrescrito pela imagem da página do
      // catálogo impresso (que mostra vários produtos, não só este).
      await prisma.product.update({
        where: { id: product.id },
        data: { catalog_page: page },
      });
      console.log(`✅ Página ${page} → ${product.name}`);
      updated++;
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`✅ ${updated} produtos atualizados`);
  console.log(`⚠️  ${notFound.length} páginas sem match:`);
  notFound.forEach((m) => console.log(`   ${m}`));

  const semPagina = products.filter((p) => !p.catalog_page);
  console.log(`\n📋 ${semPagina.length} produtos SEM página no catálogo:`);
  semPagina.forEach((p) => console.log(`   - ${p.name}`));

  await prisma.$disconnect();
}

main();
