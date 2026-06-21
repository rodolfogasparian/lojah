import "dotenv/config";
import { db } from "../lib/db";

const DESCRIPTIONS: Record<string, string> = {
  "Natuoz Bronze": "Óleo ozonizado com cenoura, urucum e camomila. Potencializa o bronzeamento, hidrata e protege a pele pós-sol com ação repelente.",
  "Natuoz Bucal": "Óleo ozonizado bucal com oliva. Cuida da saúde oral, previne mau hálito, auxilia contra cáries e reduz o tártaro.",
  "Natuoz Corpo": "Óleo ozonizado corporal com rosa mosqueta, copaíba e amêndoa doce. Hidratação profunda, combate estrias, celulites e cicatrizes.",
  "Natuoz Rosto": "Óleo ozonizado facial com semente de uva e camomila. Ação anti-idade, controla acne, manchas e linhas de expressão.",
  "Natuoz Hot": "Óleo ozonizado com canela, menta e cânfora. Para uso tópico íntimo externo com efeito vasodilatador e ação bactericida.",
  "Natuoz Power": "Óleo ozonizado com arnica, cânfora e menta. Ideal para massagens, dores musculares e recuperação esportiva.",
  "Natuoz Fios": "Óleo capilar ozonizado com abacate e linhaça. Reconstrói, nutre e fortalece os fios, reduz o frizz e estimula o crescimento.",
  "Natuoz Creme Dental": "Creme dental ozonizado livre de parabenos. Limpeza profunda, frescor prolongado e proteção das gengivas.",
  "Natuoz Desodorante": "Desodorante Natuoz sem alumínio com óleo ozonizado. Controla odores, cuida da pele e auxilia no clareamento das axilas.",
  "Natuoz Sabonete": "Sabonete líquido ozonizado. Limpeza profunda, hidratação, ação bactericida e regeneração da pele.",
  "Natuoz Creme": "Creme ozonizado para mãos com girassol e rosa mosqueta. Hidratação profunda, cuida das cutículas e atenua manchas.",
  "Loção Corporal": "Loção corporal ultra-hidratante com óleo ozonizado, amêndoas, colágeno e ureia. Ideal para pele ressecada.",
  "Rosa Mosqueta": "Óleo de rosa mosqueta rico em vitaminas e antioxidantes. Hidratação, regeneração e luminosidade para a pele.",
  "Gel Relaxante Corporal": "Gel relaxante para massagem corporal. Alivia tensões musculares, promove frescor e bem-estar.",
  "Gel de Massagem": "Gel de massagem extra forte com arnica, castanha, cânfora e óleo ozonizado. Alívio intenso de tensões.",
  "Shampoo Gold": "Shampoo Gold Hydration ozonizado. Limpeza profunda, hidratação intensa, fortalecimento e brilho radiante dos fios.",
  "Condicionador Gold": "Condicionador Gold Hydration ozonizado. Hidratação, brilho, reparação e selagem das cutículas.",
  "Máscara Gold": "Máscara Gold Hydration ozonizada com partículas de ouro. Hidratação profunda e reparação intensiva.",
  "Natuoz SH": "Shampoo e condicionador ozonizados com queratina. Limpeza, maciez e recuperação para todos os tipos de cabelo.",
  "Máscara Capilar": "Máscara capilar ozonizada para fios danificados. Força, proteção e cuidado intensivo com tratamento profundo.",
  "Men 4 em 1": "Shampoo masculino 4 em 1 com shampoo, condicionador, espuma de barbear e sabonete em um único produto.",
  "Hidra Max Fase 1": "Shampoo profissional Hidra Max para preparação e limpeza profunda dos fios antes do alinhamento.",
  "Hidra Max Fase 2": "Condicionador profissional Hidra Max para finalização, maciez e brilho após o processo de alinhamento.",
  "Alinhamento Absoluto Fase 1": "Shampoo profissional para limpeza e abertura das cutículas. Prepara os fios para o alinhamento capilar.",
  "Alinhamento Absoluto Fase 2": "Tratamento profissional para alinhamento. Sela as cutículas, alinha e devolve brilho e maciez.",
  "Natuliso": "Natuliso de chuveiro sem formol e com ozônio. Alinha os fios, reduz frizz e repõe massa capilar.",
  "Crono Power Nutri": "Ampola de nutrição com óleos de uva, coco e abacate. Nutrição intensiva, reparação e brilho capilar.",
  "Crono Power Rec": "Ampola de reconstrução com óleos de uva, coco e abacate. Reconstrói, fortalece e revitaliza fios danificados.",
  "Óleo Finalizador": "Óleo finalizador com argan e ojon. Sela cutículas, controla frizz, protege do dano e confere brilho.",
  "Protetor Térmico": "Protetor térmico com queratina e óleo de cálamo. Protege do calor, reduz quebra e adiciona brilho.",
  "Ativador de Cachos": "Ativador de cachos com colágeno e argan. Define, hidrata, nutre e controla o frizz.",
  "Balm Modelador": "Balm modelador para moldar, definir e controlar os fios com acabamento natural.",
  "Creme de Pentear": "Creme de pentear para facilitar o desembaraço, definir os fios e controlar o frizz com leveza.",
  "BB Cream": "BB cream multifuncional com proteção solar, hidratação e cobertura leve para pele uniforme.",
  "Água Micelar": "Água micelar com extrato de mirtilo. Remove maquiagem, hidrata e limpa suavemente.",
  "Creme Hidratante": "Creme hidratante ozonizado com ácido hialurônico, rosa mosqueta e vitamina E. Cuidado facial.",
  "Peeling": "Peeling de cristal ozonizado com esferas esfoliantes. Remove células mortas e promove renovação da pele.",
  "Sabonete Facial": "Sabonete facial com óleo de amêndoas e ácido hialurônico. Limpeza profunda e pele hidratada.",
  "Mousse Facial": "Mousse de limpeza facial com extratos naturais. Limpa poros, refresca e protege contra impurezas.",
  "Água Termal": "Água termal com minerais naturais. Hidrata, refresca, revitaliza e acalma a pele no uso diário.",
  "Sabonete Íntimo": "Sabonete íntimo com aloe vera e hamamélis. Cuidado suave, frescor e equilíbrio da flora.",
  "Sabonete de Banho": "Sabonete de banho ozonizado com espuma cremosa. Limpeza profunda, hidratação e fragrância envolvente.",
  "Gel Dental": "Gel dental de Aloe Vera sabor menta com mel. Limpeza bucal eficiente e hálito fresco.",
  "Desodorante em Creme": "Desodorante em creme ozonizado. Livre de alumínio, com proteção, frescor e cuidado das axilas.",
  "Pés e Pernas": "Óleo ozonizado com aloe vera e arnica. Alivia cansaço, hidrata e protege pés e pernas.",
  "Picolinato de Cromo": "Picolinato de cromo para apoiar o equilíbrio alimentar e complementar a rotina nutricional.",
  "BCAA": "BCAA com aminoácidos essenciais para redução de fadiga, recuperação muscular e suporte ao desempenho.",
  "Colostro Bovino": "Colostro bovino rico em imunoglobulinas. Fortalece a imunidade e auxilia na recuperação e saúde intestinal.",
  "Creatina Monoidratada": "Creatina monoidratada pura para ganho de força, massa muscular e desempenho nos treinos.",
  "Pré-Treino Café": "Pré-treino natural com café. Energia, foco e disposição para treinos mais intensos e produtivos.",
  "Creatina Mastigável": "Creatina mastigável para suplementar de forma prática e apoiar força e recuperação muscular.",
  "ZMA": "ZMA com zinco, magnésio e vitamina B6 para recuperação muscular, qualidade do sono e bem-estar.",
  "Laranja Doce": "Óleo essencial de laranja doce para aromaterapia. Eleva o humor, alivia estresse e perfuma ambientes.",
  "Limão Siciliano": "Óleo essencial de limão siciliano purificante. Limpa ambientes, alivia tensões e promove energia.",
  "OE Menta": "Óleo essencial de menta para frescor, foco mental e alívio de dores de cabeça.",
  "OE Melaleuca": "Óleo essencial de melaleuca com potente ação antibacteriana. Cuidado da pele e limpeza de ambientes.",
  "OE Lavanda": "Óleo essencial de lavanda para relaxamento, qualidade do sono e alívio do estresse.",
  "OE Gerânio": "Óleo essencial de gerânio para equilíbrio emocional, cuidado da pele e aromaterapia.",
  "OE Alecrim": "Óleo essencial de alecrim para foco, memória, estímulo circulatório e aromaterapia.",
  "OE Eucalipto": "Óleo essencial de eucalipto para respiração, limpeza de ambientes e bem-estar.",
  "Euphoria 100ml": "Fragrância Bortoletto inspirada em Euphoria Calvin Klein. 100ml com essência floral e amadeirada.",
  "Giro Woman 100ml": "Fragrância Bortoletto inspirada em Good Girl Carolina Herrera. 100ml com essência intensa.",
  "Aqua For Men 100ml": "Fragrância Bortoletto inspirada em Acqua di Giò Armani. 100ml com essência fresca.",
  "Invictus 100ml": "Fragrância Bortoletto inspirada em Invictus Paco Rabanne. 100ml com essência esportiva.",
};

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function main() {
  const products = await db.product.findMany({
    where: { company: { slug: "atlantica" } },
  });

  console.log("🔍 CANDIDATOS (sem gravar ainda):\n");

  const toUpdate: Array<{ id: string; name: string; description: string }> = [];
  const ambiguous: string[] = [];
  const noMatch: string[] = [];

  for (const [key, description] of Object.entries(DESCRIPTIONS)) {
    const keyNorm = normalize(key);
    const matched = products.filter((p) => normalize(p.name).includes(keyNorm));

    if (matched.length === 0) {
      noMatch.push(key);
    } else if (matched.length > 1) {
      ambiguous.push(`⚠️  "${key}" → ${matched.length} matches: ${matched.map((p) => p.name).join(", ")}`);
    } else {
      console.log(`✅ "${key}" → ${matched[0].name}`);
      toUpdate.push({ id: matched[0].id, name: matched[0].name, description });
    }
  }

  if (ambiguous.length > 0) {
    console.log("\n⚠️  AMBÍGUOS (não serão gravados):");
    ambiguous.forEach((a) => console.log("  " + a));
  }

  if (noMatch.length > 0) {
    console.log(`\n❌ SEM MATCH (${noMatch.length}):`);
    noMatch.forEach((n) => console.log(`  - ${n}`));
  }

  console.log(`\n📊 Resumo: ${toUpdate.length} prontos para gravar, ${ambiguous.length} ambíguos, ${noMatch.length} sem match`);

  // Gravar os 24 prontos
  for (const item of toUpdate) {
    await db.product.update({
      where: { id: item.id },
      data: { description: item.description },
    });
    console.log(`💾 Gravado: ${item.name}`);
  }

  // Rosa Mosqueta — só o produto exato
  const rosaM = products.find((p) => normalize(p.name) === normalize("Rosa Mosqueta 30ml"));
  if (rosaM) {
    await db.product.update({
      where: { id: rosaM.id },
      data: { description: "Óleo de rosa mosqueta rico em vitaminas e antioxidantes. Hidratação, regeneração e luminosidade para a pele." },
    });
    console.log(`💾 Gravado: ${rosaM.name}`);
  }

  console.log("\n✅ CONCLUÍDO");
  console.log("\n38 SEM MATCH — buscar nomes reais no banco:");
  noMatch.forEach((n) => console.log(`  - ${n}`));

  await db.$disconnect();
}

main();
