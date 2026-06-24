import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter } as any);

const descricoes: Record<string, string> = {
  // CABELOS
  "Condicionador Nutritivo": "Condicionador com fórmula nutritiva ozonizada. Hidrata, nutre e fortalece os fios do couro cabeludo às pontas.",
  "Condicionador Ouro 250ml": "Condicionador linha Ouro com banho de ouro ozonizado. Nutrição profunda, brilho e maciez incomparáveis para os cabelos.",
  "Condicionador Reconstrutor": "Condicionador reconstrutor ozonizado com vitamina E e D-pantenol. Repõe proteínas e restaura os fios danificados.",
  "Kit Shampoo + Condicionador Ozonizado": "Kit completo com shampoo e condicionador ozonizados. Limpeza e hidratação para cabelos mais fortes, brilhosos e saudáveis.",
  "Máscara Hidratante": "Máscara capilar hidratante ozonizada do cronograma capilar. Hidratação profunda, maciez e brilho para todos os tipos de cabelo.",
  "Máscara Ouro 250g": "Máscara Gold Hydration com banho de ouro ozonizado. Reconstrução e nutrição intensa para cabelos danificados e sem vida.",
  "Shampoo 4 em 1": "Shampoo linha Men 4 em 1 com fórmula ozonizada. Limpa cabelo, barba, corpo e serve como espuma de barbear em um só produto.",
  "Shampoo Nutritivo": "Shampoo nutritivo ozonizado com vitamina E, queratina e D-pantenol. Limpeza profunda com nutrição e proteção para os fios.",
  "Shampoo Ouro 250ml": "Shampoo linha Ouro com fórmula ozonizada premium. Limpeza suave com nutrição intensa para cabelos com brilho dourado.",
  "Shampoo Reconstrutor": "Shampoo reconstrutor ozonizado com vitamina E e D-pantenol. Reconstrói os fios danificados e devolve força e resistência.",

  // COSMÉTICOS OZONIZADOS
  "Depilskin Creme Depilatório": "Creme depilatório com fórmula ozonizada e suave para a pele. Remove os pelos com praticidade deixando a pele macia e hidratada.",
  "Gel Extra Forte Massagem": "Gel de massagem extra forte ozonizado com 120g. Alívio da dor muscular, relaxante e anti-inflamatório natural para o corpo.",
  "Hidratante Corporal Ozonizado 200ml": "Hidratante corporal ozonizado com rosa mosqueta. Proteção da pele, previne ressecamento e reduz sinais de envelhecimento.",

  // EMAGRECIMENTO
  "Green Caps Vit C": "Suplemento Green Caps com vitamina C. Antioxidante natural que auxilia na imunidade, disposição e no processo de emagrecimento saudável.",

  // LINHA ACADEMIA
  "ATL Natural Pré Treino Ponche de Frutas": "Pré-treino Natural Café com cafeína, taurina, beta-alanina e arginina. Energia, foco e performance máxima para seus treinos.",
  "Glutamina em Pó": "Glutamina em pó para recuperação muscular. Reduz o catabolismo, acelera a recuperação pós-treino e fortalece o sistema imunológico.",

  // LINHA CASA OZÔNIO
  "Amaciante Ultra Concentrado": "Amaciante ultra concentrado com fórmula ozonizada. Deixa as roupas macias, perfumadas e protegidas com muito mais rendimento.",
  "Home Spray Bamboo Ultra Concentrado": "Home spray bamboo ultra concentrado com fórmula ozonizada. Ambiente perfumado, fresco e agradável com apenas alguns borrifos.",
  "Lava-Louças Ultra Concentrado": "Lava-louças ultra concentrado com fórmula ozonizada. Remove gordura e sujeira com eficiência, rendendo muito mais por gota.",
  "Lava-Roupas Ultra Concentrado": "Lava-roupas ultra concentrado com fórmula ozonizada. Limpeza profunda das roupas com alto rendimento e proteção dos tecidos.",
  "Limpador Multiuso Ultra Concentrado": "Limpador multiuso ultra concentrado com fórmula ozonizada. Limpa e higieniza diversas superfícies com eficiência e economia.",
  "Odorizador Número 2": "Odorizador sanitário número 2 com fórmula ozonizada. Elimina odores desagradáveis e deixa o ambiente do banheiro fresco e limpo.",

  // ÓLEOS ESSENCIAIS
  "Óleo Essencial Menta Piperita": "Óleo essencial de menta piperita 100% puro. Auxilia no sistema respiratório, digestivo e urinário, com mais de 200 benefícios comprovados.",

  // SUPLEMENTOS
  "ATL Vision 30ml": "Suplemento ATL Vision em gotas. Previne catarata e glaucoma, melhora a qualidade da visão e controla a pressão nos olhos.",

  // VITAMINAS
  "Cranberry Cápsulas": "Suplemento de cranberry em cápsulas. Rico em antioxidantes, auxilia na saúde urinária, imunidade e prevenção de infecções.",
  "Magnésio Bisglicinato": "Magnésio bisglicinato em cápsulas com alta absorção. Reduz estresse, melhora o sono, alivia cãibras e apoia a função muscular.",
  "Vitamina C Ácido Ascórbico Cáps": "Vitamina C em cápsulas de ácido ascórbico. Potente antioxidante que fortalece a imunidade, colágeno e protege as células.",

  // PERFUMES BORTOLETTO 15ml
  "Fragrância Al-Asad 15ml": "Fragrância Bortoletto Al-Asad 15ml. Perfume de longa duração com embalagem e rótulo personalizados. Sofisticado e marcante.",
  "Fragrância Athenna 15ml": "Fragrância Bortoletto Athenna 15ml. Perfume personalizado com embalagem exclusiva. Suave e elegante para o dia a dia.",
  "Fragrância Bali 15ml": "Fragrância Bortoletto Bali 15ml. Perfume tropical e envolvente com embalagem personalizada. Fresco e duradouro.",
  "Fragrância Black Privat 15ml": "Fragrância Bortoletto Black Privat 15ml. Perfume intenso e sofisticado com embalagem personalizada. Para ocasiões especiais.",
  "Fragrância Euphorica 15ml": "Fragrância Bortoletto Euphorica 15ml. Perfume feminino floral e sofisticado com embalagem personalizada e longa duração.",
  "Fragrância F. Lavina 15ml": "Fragrância Bortoletto F. Lavina 15ml. Perfume delicado e feminino com embalagem personalizada. Elegante e marcante.",
  "Fragrância For You 15ml": "Fragrância Bortoletto For You 15ml. Perfume suave e romântico com embalagem personalizada. Ideal para o uso diário.",
  "Fragrância Good Woman 15ml": "Fragrância Bortoletto Good Woman 15ml. Perfume feminino marcante e duradouro com embalagem e rótulo personalizados.",
  "Fragrância Imortal 15ml": "Fragrância Bortoletto Imortal 15ml. Perfume masculino intenso e duradouro com embalagem personalizada exclusiva.",
  "Fragrância Imortal Black 15ml": "Fragrância Bortoletto Imortal Black 15ml. Versão sofisticada do Imortal com notas mais intensas e embalagem personalizada.",
  "Fragrância J Alphaa 15ml": "Fragrância Bortoletto J Alphaa 15ml. Perfume masculino marcante com embalagem personalizada e longa duração.",
  "Fragrância Love Me 15ml": "Fragrância Bortoletto Love Me 15ml. Perfume feminino romântico e envolvente com embalagem e rótulo personalizados.",
  "Fragrância Loved 15ml": "Fragrância Bortoletto Loved 15ml. Perfume suave e sofisticado com embalagem personalizada. Delicado e duradouro.",
  "Fragrância Match 15ml": "Fragrância Bortoletto Match 15ml. Perfume versátil e marcante com embalagem personalizada. Ideal para qualquer ocasião.",
  "Fragrância Phakar Black 15ml": "Fragrância Bortoletto Phakar Black 15ml. Perfume masculino intenso e sofisticado com embalagem e rótulo personalizados.",
  "Fragrância Phakar Rose 15ml": "Fragrância Bortoletto Phakar Rose 15ml. Perfume feminino floral e romântico com embalagem personalizada exclusiva.",
  "Fragrância Royale 15ml": "Fragrância Bortoletto Royale 15ml. Perfume premium com notas sofisticadas e embalagem personalizada de alta qualidade.",
  "Fragrância 521 Sexy's 15ml": "Fragrância Bortoletto 521 Sexy's 15ml. Perfume feminino sensual e marcante com embalagem e rótulo personalizados.",
  "Fragrância 521 Vip Rose 15ml": "Fragrância Bortoletto 521 Vip Rose 15ml. Perfume feminino floral e luxuoso com embalagem personalizada exclusiva.",
  "Fragrância Yaha 15ml": "Fragrância Bortoletto Yaha 15ml. Perfume suave e elegante com embalagem personalizada. Fresco e duradouro para o dia a dia.",
  "Fragrância Club For Men 15ml": "Fragrância Bortoletto Club For Men 15ml. Perfume masculino fresco e sofisticado com embalagem e rótulo personalizados.",

  // PERFUMES BORTOLETTO 100ml
  "Fragrância Al-Asad 100ml": "Fragrância Bortoletto Al-Asad 100ml Eau de Parfum. Versão ampliada do clássico Al-Asad, sofisticado e marcante com longa fixação.",
  "Fragrância Amore Mio 100ml": "Fragrância Bortoletto Amore Mio 100ml Eau de Parfum. Perfume feminino romântico e luxuoso com notas florais de longa duração.",
};

async function main() {
  let atualizados = 0;
  let naoEncontrados: string[] = [];

  for (const [nome, descricao] of Object.entries(descricoes)) {
    const resultado = await db.product.updateMany({
      where: {
        name: nome,
        description: null,
      },
      data: { description: descricao },
    });

    if (resultado.count > 0) {
      atualizados += resultado.count;
      console.log(`✓ ${nome}`);
    } else {
      naoEncontrados.push(nome);
    }
  }

  console.log(`\n✅ ${atualizados} produtos atualizados`);
  if (naoEncontrados.length > 0) {
    console.log(`\n⚠️ Não encontrados (já tinham descrição ou nome diferente):`);
    naoEncontrados.forEach(n => console.log(`  - ${n}`));
  }

  await db.$disconnect();
  await pool.end();
}

main().catch(console.error);
