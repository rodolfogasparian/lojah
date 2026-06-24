import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter } as any);

const descricoes: Record<string, string> = {
  // SUPLEMENTOS
  "5 Magnésios": "Complexo com 5 formas de magnésio: dimalato, taurato, bisglicinato, sulfato e óxido. Reduz estresse, melhora o sono e apoia a função muscular.",
  "A-Z Complex Mulher 60 Cáps": "Polivitamínico A-Z Complex Mulher com 60 cápsulas. Mantém saúde da pele, unhas e cabelos, imunidade e vitalidade com antioxidantes.",
  "A-Z Complex Multi 60 Cáps": "Polivitamínico A-Z Complex Multi com 60 cápsulas. Auxilia no crescimento do sistema imune, manutenção da saúde e melhora do metabolismo.",
  "Aloe Vera Gotas": "Aloe vera concentrado em gotas 30ml. Auxilia na má digestão, alivia queimação no estômago, trata gastrites e refluxos com efeito detox.",
  "Beijo Bom Spray Bucal Ozonizado": "Spray bucal ozonizado 18ml. Neutraliza odores bucais, combate cáries, aftas e infecções da boca e garganta com ação antisséptica.",
  "Biotina Mastigável 60 Comp": "Biotina mastigável sabor morango com 60 comprimidos. Fortalece cabelos, unhas e pele com vitamina B7 de alta absorção.",
  "Cart Control 60 Cáps": "Cart Control 60 cápsulas com cártamo, coco, chia e cromo. Potencializa a queima de gordura, sensação de saciedade e acelera o metabolismo.",
  "Carvão Ativado": "Carvão ativado 15g em pó clareador. Higienização dental com carvão ativado, remove manchas e clarea os dentes naturalmente.",
  "Chá Verde com Gengibre": "Chá verde com gengibre e semente de chia 200g. Termogênico e antioxidante que auxilia na queima de gordura e contribui para o emagrecimento.",
  "Chlorella 60 Cáps": "Chlorella 60 cápsulas 500mg. Previne anemia, melhora a saúde da pele e cabelos, evita inflamações e controla a pressão alta.",
  "Cloreto de Magnésio 60 Cáps": "Cloreto de magnésio 60 cápsulas. Ajuda na absorção de vitamina D, melhora funcionamento muscular e tem propriedades anti-inflamatórias.",
  "Coenzima Q10 60 Cáps": "Coenzima Q10 60 cápsulas 450mg. Melhora performance durante exercício, previne doenças cardiovasculares e envelhecimento precoce.",
  "Complexo B 60 Comp": "Complexo B 60 comprimidos 450mg. Suporte completo ao sistema nervoso, produção de energia e saúde da pele, cabelos e unhas.",
  "Condicionador Infantil 250ml": "Condicionador infantil 250ml com óleo de coco e óleo de abacate. Fórmula ozonizada que suaviza, hidrata e cuida dos fios sem agredir.",
  "Dermo - Creme Rosto Hidratante Ozonizado": "Creme hidratante facial Dermo Natuoz 50g com ácido hialurônico, rosa mosqueta, vitamina E e pantenol. Hidratação profunda com toque seco.",
  "Dermo - Máscara Argila Ozonizado": "Máscara facial de argila verde com espirulina ozonizada 130g. Limpeza profunda dos poros, controle da oleosidade e pele mais uniforme.",
  "Eleva Day 60 Cáps": "Eleva Day 60 cápsulas com feno grego, boro, arginina, taurina e complexo B. Estimula testosterona, libido e auxilia na fertilidade.",
  "Esfoliante Corporal 250ml": "Esfoliante corporal ozonizado 250ml. Remove células mortas, deixa a pele macia e sedosa. Indicado para pré-tratamentos corporais.",
  "Espirulina 60 Cáps": "Espirulina microalga 60 cápsulas 500mg. Auxilia na imunidade, previne anemia, melhora pele e cabelos e estimula o sistema imunológico.",
  "Essencial Beauty 60 Cáps": "Essencial Beauty 60 cápsulas para pele, cabelo e unhas. Muito mais saúde e beleza com polivitamínico A-Z.",
  "Extrato de Própolis Verde": "Extrato de própolis verde em gotas 30ml. Antibiótico natural, fortalece o sistema imunológico e auxilia no tratamento de doenças respiratórias.",
  "Ferro": "Ferro em gotas 30ml com vitamina C sabor framboesa 7mg/ml. Auxilia no controle da anemia, disposição e saúde do sangue.",
  "Fibras Complex 90 Cáps": "Fibras Complex 90 cápsulas com quitosana, espirulina, psyllium, inulina e picolinato de cromo. Auxilia no trânsito intestinal e saciedade.",
  "Focuss - Energia": "Focuss 90 cápsulas 500mg. Estimula a queima de calorias, aumenta a energia e disposição, acelera o metabolismo e auxilia no emagrecimento.",
  "Geleia Real": "Geleia real em cápsulas 350mg. Fortalece o sistema imunológico, aumenta as defesas naturais do organismo e melhora a vitalidade.",
  "Home Spray Lavanda Ultra Concentrado": "Home spray lavanda ultra concentrado com fórmula ozonizada. Ambiente perfumado com aroma relaxante de lavanda e alto rendimento.",
  "L-Triptofano 60 Cáps": "L-Triptofano 60 cápsulas 500mg com magnésio, zinco e vitaminas B6 e B9. Melhora o sono, reduz estresse e combate a depressão e ansiedade.",
  "Leave In 10x Rosa Mosqueta": "Leave-in 10x com rosa mosqueta ozonizado. Proteção e nutrição para os fios sem enxágue, com ação anti-frizz e brilho intenso.",
  "Life Control 35ml": "Life Control 35ml, fitonutriente à base de frutos Goji e amora. Combate ansiedade e compulsão, inibe a vontade de ingerir álcool.",
  "Magnésio Dimalato Cápsulas": "Magnésio dimalato em cápsulas mastigáveis sabor tutti-frutti 1400mg. Reduz estresse, cansaço e apoia a função muscular e nervosa.",
  "Máscara Capilar Nutritiva": "Máscara capilar nutritiva ozonizada. Nutrição profunda dos fios com óleos essenciais, restaurando maciez, brilho e vitalidade.",
  "Máscara Capilar Ozonizado": "Máscara capilar ozonizada Gold Hydration com banho de ouro. Reconstrução e nutrição intensa para cabelos danificados e opacos.",
  "Máscara Capilar Reconstrutora": "Máscara capilar reconstrutora ozonizada. Repõe proteínas e restaura a estrutura dos fios danificados com brilho e maciez.",
  "Mastigável Magnésio Dimalato": "Magnésio dimalato mastigável sabor tutti-frutti 1400mg. Fórmula de fácil absorção que reduz estresse, cansaço e melhora o sono.",
  "Melatonina 60 Cáps": "Melatonina 60 cápsulas 0,21mg. Regula o ciclo circadiano, trata insônia, fortalece o sistema imunológico e melhora a qualidade do sono.",
  "Menta Doce": "Menta doce em gotas 10ml. Auxilia no sistema respiratório, digestivo e urinário. Produto com mais de 200 benefícios comprovados.",
  "Mind Expert": "Mind Expert 30ml em gotas. Melhora o foco, concentração e memória. Auxilia no combate à ansiedade, estresse oxidativo e fadiga mental.",
  "NatuVitta": "NatuVitta 60 cápsulas com condroitina, colágeno tipo II, MSM e cúrcuma. Auxilia nas dores articulares, artrose, artrite e osteoporose.",
  "Night Chá - Sono Bom": "Night Chá Sono Bom 200g instantâneo e solúvel. Melhoria do sono, alivia estados de estresse e melhora o sistema digestivo.",
  "Óleo de Abacate": "Óleo de abacate 60 cápsulas 1340mg. Rico em gorduras saudáveis, auxilia na saúde cardiovascular, absorção de nutrientes e saciedade.",
  "Óleo Essencial Alecrim": "Óleo essencial de alecrim 100% puro 10ml. Estimulante capilar, melhora circulação, memória e concentração com aromaterapia.",
  "Óleo Essencial Eucalipto": "Óleo essencial de eucalipto 100% puro 10ml. Auxilia no sistema respiratório, ação antisséptica e relaxante com aromaterapia.",
  "Óleo Essencial Gerânio": "Óleo essencial de gerânio 100% puro 10ml. Equilibra emoções, auxilia na pele oleosa e tem propriedades anti-inflamatórias.",
  "Óleo Essencial Lavanda": "Óleo essencial de lavanda 100% puro 10ml. Relaxante, ansiolítico e calmante natural para uso em aromaterapia e cuidados com a pele.",
  "Óleo Essencial Melaleuca": "Óleo essencial de melaleuca Tea Tree 100% puro 10ml. Ação antifúngica, antibacteriana e antisséptica para pele e aromaterapia.",
  "Ômega 3 Óleo de Peixe 60 Cáps": "Ômega 3 DHA e EPA 60 cápsulas 1450mg com selo MEG-3. Controla pressão arterial, reduz colesterol e triglicérides, anti-inflamatório.",
  "Ora Pro Nóbis 200g": "Ora Pro Nóbis 200g sabor limão com hortelã. Suplemento em pó rico em proteínas, ferro e vitaminas para nutrição completa.",
  "Peel-Off Máscara Facial": "Peel-Off máscara facial removível. Limpeza profunda dos poros, remove cravos e células mortas deixando a pele limpa e renovada.",
  "Protetor Solar Corporal FPS30 180ml": "Protetor solar corporal FPS30 180ml ozonizado. Proteção UVA e UVB com ação antioxidante, clareadora e controladora da oleosidade.",
  "Protetor Solar Facial FPS60 60ml": "Protetor solar facial FPS60 60ml ozonizado. Proteção máxima UVA e UVB com textura leve, antioxidante e controle da oleosidade.",
  "Resveratrol Longevity": "Resveratrol Longevity com semente de uva 60 cápsulas. Potente antioxidante que previne o envelhecimento precoce e protege as células.",
  "Sérum Colágeno 18ml": "Sérum facial de colágeno ozonizado 18ml. Hidratação profunda, melhora da elasticidade, redução de rugas e promoção da regeneração celular.",
  "Sérum Hialurônico 18ml": "Sérum facial de ácido hialurônico ozonizado 18ml. Hidratação profunda, redução de rugas e linhas finas com ação antioxidante.",
  "Sérum Niacinamida 18ml": "Sérum facial de niacinamida ozonizado 18ml. Reduz oleosidade, minimiza poros, clareia a pele e oferece hidratação e proteção antioxidante.",
  "Sérum Vitamina C 18ml": "Sérum facial de vitamina C ozonizado 18ml. Antioxidante, ilumina a pele, estimula o colágeno, hidrata e oferece proteção UV.",
  "Shake Baunilha": "Shake Atlântica Natural sabor baunilha 400g. Substituto parcial de refeição com 13g de proteína, zero açúcar e adoçado com stévia.",
  "Shake Chocolate": "Shake Atlântica Natural sabor chocolate 400g. Substituto parcial de refeição com 13g de proteína, zero açúcar e adoçado com stévia.",
  "Shake de Cookies": "Shake Atlântica Natural sabor cookies and cream 400g. Substituto parcial de refeição com 13g de proteína, zero açúcar e alto em fibras.",
  "Shake Morango": "Shake Atlântica Natural sabor morango 400g. Substituto parcial de refeição com 13g de proteína, zero açúcar e adoçado com stévia.",
  "Shake Pão de Mel": "Shake Atlântica Natural sabor pão de mel 400g. Substituto parcial de refeição com 13g de proteína, zero açúcar e alto em fibras.",
  "Shake Vitamina de Frutas": "Shake Atlântica Natural sabor vitamina de frutas 400g. Substituto parcial de refeição com 13g de proteína, zero açúcar e stévia.",
  "Shampoo Infantil 250ml": "Shampoo infantil 250ml com óleo de coco e óleo de abacate. Fórmula ozonizada suave, não arde os olhos e para todos os tipos de fios.",
  "Suco Aloe Vera 500ml": "Suco de aloe vera 500ml sabor abacaxi. Fortalece o sistema imunológico, ação antioxidante e auxilia na regeneração da pele.",
  "Thermo Heat Chá": "Thermo Heat 200g instantâneo e solúvel sabor laranja. Termogênico que acelera o metabolismo, fornece energia e auxilia no emagrecimento.",
  "Vital Life 500ml": "Vital Life 500ml com colina e vitaminas B1 e B6. Previne inflamação no intestino, promove desintoxicação no fígado e combate problemas digestivos.",
  "Vitamina A Gotas": "Vitamina A em gotas 30ml. Essencial para a visão, saúde da pele, sistema imunológico e crescimento celular saudável.",
  "Vitamina B12": "Vitamina B12 em gotas 30ml. Essencial para o sistema nervoso, produção de glóbulos vermelhos e manutenção da energia e disposição.",
  "Vitamina B12 Metilcobalamina Mastigável": "Vitamina B12 metilcobalamina mastigável. Forma mais biodisponível da B12 para energia, sistema nervoso e saúde dos glóbulos vermelhos.",

  // PERFUMES BORTOLETTO 15ml restantes
  "Fragrância 521 Hera Vip 15ml": "Fragrância Bortoletto 521 Hera Vip 15ml. Perfume feminino luxuoso e sofisticado com embalagem personalizada e longa duração.",
  "Fragrância 521 Number Men 15ml": "Fragrância Bortoletto 521 Number Men 15ml. Perfume masculino marcante e sofisticado com embalagem e rótulo personalizados.",
  "Fragrância 521 Vip Black 15ml": "Fragrância Bortoletto 521 Vip Black 15ml. Perfume masculino intenso e exclusivo com embalagem personalizada de alta qualidade.",
  "Fragrância 521 Vip Men 15ml": "Fragrância Bortoletto 521 Vip Men 15ml. Perfume masculino premium com notas sofisticadas e embalagem e rótulo personalizados.",
  "Fragrância Amore Mio 15ml": "Fragrância Bortoletto Amore Mio 15ml. Perfume feminino romântico e luxuoso com notas florais e embalagem personalizada exclusiva.",
  "Fragrância Angeli 15ml": "Fragrância Bortoletto Angeli 15ml. Perfume feminino delicado e angelical com embalagem personalizada e longa fixação.",
  "Fragrância Blackout Silver 15ml": "Fragrância Bortoletto Blackout Silver 15ml. Perfume masculino moderno e marcante com embalagem e rótulo personalizados exclusivos.",
  "Fragrância Champion 15ml": "Fragrância Bortoletto Champion 15ml. Perfume masculino esportivo e vibrante com embalagem personalizada e longa duração.",
  "Fragrância Cloes 15ml": "Fragrância Bortoletto Cloes 15ml. Perfume feminino elegante e sofisticado com embalagem e rótulo personalizados de alta qualidade.",
  "Fragrância Crazy Love 15ml": "Fragrância Bortoletto Crazy Love 15ml. Perfume feminino apaixonante e marcante com embalagem personalizada e fixação duradoura.",
  "Fragrância Dark Bloom 15ml": "Fragrância Bortoletto Dark Bloom 15ml. Perfume masculino misterioso e intenso com embalagem e rótulo personalizados exclusivos.",
  "Fragrância Esplêndida 15ml": "Fragrância Bortoletto Esplêndida 15ml. Perfume feminino esplêndido e marcante com embalagem personalizada e longa duração.",
  "Fragrância Fama 15ml": "Fragrância Bortoletto Fama 15ml. Perfume feminino glamouroso e sofisticado com embalagem e rótulo personalizados de alta qualidade.",
  "Fragrância Fantastic 15ml": "Fragrância Bortoletto Fantastic 15ml. Perfume feminino fresco e envolvente com embalagem personalizada e excelente fixação.",
  "Fragrância Fortune 15ml": "Fragrância Bortoletto Fortune 15ml. Perfume masculino sofisticado e marcante com embalagem e rótulo personalizados exclusivos.",
  "Fragrância Gabby 15ml": "Fragrância Bortoletto Gabby 15ml. Perfume feminino suave e elegante com embalagem personalizada e longa duração no dia a dia.",
  "Fragrância Idoll 15ml": "Fragrância Bortoletto Idoll 15ml. Perfume feminino icônico e sofisticado com embalagem e rótulo personalizados de alta qualidade.",
  "Fragrância Indomável 15ml": "Fragrância Bortoletto Indomável 15ml. Perfume masculino forte e marcante com embalagem personalizada e longa fixação.",
  "Fragrância Khalifa 15ml": "Fragrância Bortoletto Khalifa 15ml. Perfume masculino oriental e sofisticado com embalagem e rótulo personalizados exclusivos.",
  "Fragrância La Bella 15ml": "Fragrância Bortoletto La Bella 15ml. Perfume feminino delicado e sofisticado com embalagem personalizada e excelente fixação.",
  "Fragrância Luxuria 15ml": "Fragrância Bortoletto Luxuria 15ml. Perfume feminino luxuoso e sensual com embalagem e rótulo personalizados de alta qualidade.",
  "Fragrância Madeleine 15ml": "Fragrância Bortoletto Madeleine 15ml. Perfume feminino clássico e elegante com embalagem personalizada e longa duração.",
  "Fragrância Miss Charm 15ml": "Fragrância Bortoletto Miss Charm 15ml. Perfume feminino charmoso e envolvente com embalagem e rótulo personalizados exclusivos.",
  "Fragrância Phamous 15ml": "Fragrância Bortoletto Phamous 15ml. Perfume masculino famoso e marcante com embalagem personalizada e longa fixação.",
  "Fragrância Play Men 15ml": "Fragrância Bortoletto Play Men 15ml. Perfume masculino jovem e vibrante com embalagem e rótulo personalizados de alta qualidade.",
  "Fragrância Polo Club 15ml": "Fragrância Bortoletto Polo Club 15ml. Perfume masculino clássico e sofisticado com embalagem personalizada e longa duração.",
  "Fragrância Racing Car 15ml": "Fragrância Bortoletto Racing Car 15ml. Perfume masculino esportivo e intenso com embalagem e rótulo personalizados exclusivos.",
  "Fragrância Rouge 15ml": "Fragrância Bortoletto Rouge 15ml. Perfume feminino sensual e marcante com embalagem personalizada e excelente fixação.",
  "Fragrância Scent 15ml": "Fragrância Bortoletto Scent 15ml. Perfume sofisticado e marcante com embalagem e rótulo personalizados de alta qualidade.",
  "Fragrância The Boss 15ml": "Fragrância Bortoletto The Boss 15ml. Perfume masculino imponente e sofisticado com embalagem personalizada e longa duração.",
  "Fragrância Vênus 15ml": "Fragrância Bortoletto Vênus 15ml. Perfume feminino divino e envolvente com embalagem e rótulo personalizados exclusivos.",
  "Fragrância Very Summer 15ml": "Fragrância Bortoletto Very Summer 15ml. Perfume fresco e tropical com embalagem personalizada e excelente fixação para o verão.",
  "Fragrância Zeus 15ml": "Fragrância Bortoletto Zeus 15ml. Perfume masculino poderoso e marcante com embalagem e rótulo personalizados de alta qualidade.",

  // PERFUMES BORTOLETTO 100ml restantes
  "Fragrância 521 Sexy's 100ml": "Fragrância Bortoletto 521 Sexy's 100ml Eau de Parfum. Versão ampliada do clássico Sexy's, feminino e sensual com longa fixação.",
  "Fragrância Athenna 100ml": "Fragrância Bortoletto Athenna 100ml Eau de Parfum. Versão ampliada do Athenna, suave e elegante com longa duração.",
  "Fragrância Bali 100ml": "Fragrância Bortoletto Bali 100ml Eau de Parfum. Versão ampliada do tropical Bali, fresco e envolvente com excelente fixação.",
  "Fragrância Club For Men 100ml": "Fragrância Bortoletto Club For Men 100ml Eau de Parfum. Versão ampliada do clássico masculino fresco e sofisticado.",
  "Fragrância Euphorica 100ml": "Fragrância Bortoletto Euphorica 100ml Eau de Parfum. Versão ampliada do feminino Euphorica com longa duração e fixação premium.",
  "Fragrância F. Lavina 100ml": "Fragrância Bortoletto F. Lavina 100ml Eau de Parfum. Versão ampliada do delicado F. Lavina, elegante e marcante.",
  "Fragrância For You 100ml": "Fragrância Bortoletto For You 100ml Eau de Parfum. Versão ampliada do romântico For You com longa duração e fixação premium.",
  "Fragrância Good Woman 100ml": "Fragrância Bortoletto Good Woman 100ml Eau de Parfum. Versão ampliada do marcante Good Woman, feminino e duradouro.",
  "Fragrância Imortal 100ml": "Fragrância Bortoletto Imortal 100ml Eau de Parfum. Versão ampliada do masculino intenso Imortal com longa fixação premium.",
  "Fragrância Imortal Black 100ml": "Fragrância Bortoletto Imortal Black 100ml Eau de Parfum. Versão ampliada do sofisticado Imortal Black com fixação premium.",
  "Fragrância J Alphaa 100ml": "Fragrância Bortoletto J Alphaa 100ml Eau de Parfum. Versão ampliada do masculino marcante J Alphaa com longa duração.",
  "Fragrância Loved 100ml": "Fragrância Bortoletto Loved 100ml Eau de Parfum. Versão ampliada do sofisticado Loved, suave e duradouro com fixação premium.",
  "Fragrância Match 100ml": "Fragrância Bortoletto Match 100ml Eau de Parfum. Versão ampliada do versátil Match, marcante e com excelente fixação.",
  "Fragrância Phakar Black 100ml": "Fragrância Bortoletto Phakar Black 100ml Eau de Parfum. Versão ampliada do intenso Phakar Black com longa fixação premium.",
  "Fragrância Phakar Rose 100ml": "Fragrância Bortoletto Phakar Rose 100ml Eau de Parfum. Versão ampliada do feminino floral Phakar Rose com fixação premium.",
  "Fragrância Royale 100ml": "Fragrância Bortoletto Royale 100ml Eau de Parfum. Versão ampliada do premium Royale com notas sofisticadas e longa fixação.",
  "Fragrância Yaha 100ml": "Fragrância Bortoletto Yaha 100ml Eau de Parfum. Versão ampliada do elegante Yaha, fresco e duradouro com fixação premium.",
};

async function main() {
  let atualizados = 0;
  let naoEncontrados: string[] = [];

  for (const [nome, descricao] of Object.entries(descricoes)) {
    const resultado = await db.product.updateMany({
      where: { name: nome, description: null },
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
    console.log(`\n⚠️ Não encontrados:`);
    naoEncontrados.forEach(n => console.log(`  - ${n}`));
  }

  await db.$disconnect();
  await pool.end();
}

main().catch(console.error);
