import "dotenv/config";
import { db } from "../lib/db";

const DESCRIPTIONS: Record<string, string> = {
  // LINHA OZONIZADA
  "Natuoz - Óleo Ozonizado 20ml": "Óleo de girassol ozonizado para uso tópico. Hidrata, renova as células e auxilia na cicatrização da pele. Ação anti-idade e bactericida.",
  "Natuoz Family - Óleo Ozonizado 50ml": "Versão family do óleo ozonizado Natuoz com 50ml. Hidratação profunda, renovação celular e cicatrização. Ideal para uso em família.",
  "Natuoz Bronze": "Óleo ozonizado com cenoura, urucum e camomila. Potencializa o bronzeamento, hidrata e protege a pele pós-sol com ação repelente.",
  "Natuoz Bucal": "Óleo ozonizado bucal com oliva. Cuida da saúde oral, previne mau hálito, auxilia contra cáries e reduz o tártaro.",
  "Natuoz Corpo": "Óleo ozonizado corporal com rosa mosqueta, copaíba e amêndoa doce. Hidratação profunda, combate estrias, celulites e cicatrizes.",
  "Natuoz Rosto": "Óleo ozonizado facial com semente de uva e camomila. Ação anti-idade, controla acne, manchas e linhas de expressão.",
  "Natuoz Hot": "Óleo ozonizado com canela, menta e cânfora. Para uso tópico íntimo externo com efeito vasodilatador e ação bactericida.",
  "Natuoz Power": "Óleo ozonizado com arnica, cânfora e menta. Ideal para massagens, dores musculares e recuperação esportiva.",
  "Natuoz Fios": "Óleo capilar ozonizado com abacate e linhaça. Reconstrói, nutre e fortalece os fios, reduz o frizz e estimula o crescimento.",
  "Natuoz Óleo Íntimo": "Óleo ozonizado íntimo para uso externo. Atenua manchas, inibe odores e apoia o equilíbrio da flora íntima.",
  "Natuoz Pés e Pernas": "Óleo ozonizado com aloe vera, melaleuca e arnica. Alivia cansaço, hidrata e protege contra frieiras nos pés e pernas.",
  "Natuoz Creme Dental": "Creme dental ozonizado livre de parabenos. Limpeza profunda, frescor prolongado e proteção das gengivas no dia a dia.",
  "Natuoz Desodorante": "Desodorante Natuoz sem alumínio com óleo ozonizado. Controla odores, cuida da pele e auxilia no clareamento das axilas.",
  "Natuoz Sabonete Líquido": "Sabonete líquido ozonizado. Limpeza profunda, hidratação, ação bactericida e regeneração da pele no uso diário.",
  "Natucap Ozonizado 60 Cáps": "Natucap ozonizado em cápsulas. Ação antioxidante, suporte imunológico e melhora da oxigenação dos tecidos. Para homens e mulheres.",
  "Natuoz Hialurônico - Ozonizado": "Sérum ozonizado com ácido hialurônico. Hidratação intensa, preenchimento de linhas finas e renovação da pele facial.",
  "Creme Dental Ozonizado": "Creme dental ozonizado para higiene bucal diária. Limpeza profunda, proteção das gengivas e frescor prolongado.",
  "Desodorante Ozonizado": "Desodorante em creme ozonizado com rosa e algodão. Livre de álcool e alumínio. Proteção, frescor e cuidado das axilas.",
  "Sabonete Banho Ozonizado": "Sabonete de banho ozonizado com espuma cremosa. Limpeza profunda, hidratação e fragrância envolvente no banho.",
  "Pasta Dental Creme Novo 90g": "Pasta dental ozonizada para higiene bucal diária. Limpeza, proteção e frescor prolongado para dentes e gengivas.",

  // COSMÉTICOS OZONIZADOS
  "Hidratante Encantada": "Hidratante corporal ozonizado com textura leve. Hidratação intensa, pele suave e fragrância encantadora no uso diário.",
  "Hidratante Radiante": "Hidratante corporal ozonizado com extratos florais. Hidratação profunda, pele macia e fragrância suave ao longo do dia.",
  "Hidratante Sensual": "Hidratante corporal ozonizado de rápida absorção. Pele macia, perfumada e hidratada com fragrância envolvente.",
  "Hidratante Corporal Ozonizado 200ml": "Hidratante corporal ultra-hidratante com óleo de girassol ozonizado, colágeno e ureia. Indicado para pele ressecada.",
  "Gel Redutor 250ml": "Gel redutor corporal ozonizado para massagem modeladora. Auxilia na redução de medidas e bem-estar corporal.",
  "Gel Relaxante 250ml": "Gel relaxante corporal para massagem. Alivia tensões, promove frescor e relaxamento muscular profundo.",
  "Gel Extra Forte Massagem": "Gel de massagem extra forte com arnica, castanha da Índia, cânfora, andiroba e óleo ozonizado. Ação intensa.",
  "Depilskin Creme Depilatório": "Creme depilatório para remoção suave dos pelos. Fórmula desenvolvida para pele macia e cuidada após a depilação.",
  "Natuoz Creme": "Creme ozonizado para mãos com girassol e rosa mosqueta. Hidratação profunda, cuida das cutículas e atenua manchas.",
  "Loção Corporal": "Loção corporal ultra-hidratante com óleo ozonizado, amêndoas, colágeno e ureia. Ideal para pele ressecada.",
  "Rosa Mosqueta": "Óleo de rosa mosqueta rico em vitaminas e antioxidantes. Hidratação, regeneração e luminosidade para a pele.",
  "Gel Relaxante Corporal": "Gel relaxante para massagem corporal. Alivia tensões musculares, promove frescor e bem-estar no uso diário.",
  "Gel de Massagem Extra Forte": "Gel de massagem extra forte com arnica, castanha, cânfora e óleo ozonizado. Para alívio intenso de tensões.",

  // COSMÉTICOS — CABELOS
  "Shampoo Gold Hydration": "Shampoo Gold Hydration ozonizado. Limpeza profunda, hidratação intensa, fortalecimento e brilho radiante dos fios.",
  "Condicionador Gold Hydration": "Condicionador Gold Hydration ozonizado. Hidratação, brilho, reparação e selagem das cutículas para cabelos macios.",
  "Máscara Gold Hydration": "Máscara Gold Hydration ozonizada com partículas de ouro. Hidratação profunda, reparação intensiva e brilho capilar.",
  "Shampoo Hidratante": "Shampoo hidratante para limpeza suave e hidratação profunda. Revitaliza cabelos secos ou danificados.",
  "Condicionador Hidratante": "Condicionador hidratante para hidratação intensa, desembaraço, suavidade e brilho dos fios.",
  "Máscara Hidratante": "Máscara hidratante premium para tratamento profundo. Revitaliza, amacia e hidrata os cabelos de forma duradoura.",
  "Shampoo Reconstrutor": "Shampoo reconstrutor para fios fragilizados. Devolve força, resistência e massa capilar com limpeza suave.",
  "Condicionador Reconstrutor": "Condicionador reconstrutor para reparar a fibra capilar. Fortalece, hidrata e melhora a elasticidade dos fios.",
  "Shampoo Nutritivo": "Shampoo nutritivo para limpeza suave e reposição de nutrientes. Preserva a maciez e o brilho natural dos fios.",
  "Condicionador Nutritivo": "Condicionador nutritivo para hidratação imediata. Sela as cutículas, reduz frizz e proporciona toque sedoso.",
  "Shampoo Ouro 250ml": "Shampoo com ativos premium para brilho, resistência e cuidado intensivo dos cabelos no uso diário.",
  "Condicionador Ouro 250ml": "Condicionador ouro para nutrição, brilho e maciez. Cuida dos fios com textura leve e eficácia comprovada.",
  "Máscara Ouro 250g": "Máscara capilar ouro para tratamento intensivo. Nutre, fortalece e realça o brilho natural dos cabelos.",
  "Shampoo 4 em 1": "Shampoo 4 em 1 que combina shampoo, condicionador, cuidado e proteção em uma única etapa prática.",
  "Kit Shampoo + Condicionador Ozonizado": "Kit com shampoo e condicionador ozonizados. Limpeza, hidratação e cuidado completo para todos os tipos de cabelo.",
  "Natuoz SH e CD": "Shampoo e condicionador ozonizados com queratina. Limpeza, maciez e recuperação para todos os tipos de cabelo.",
  "Máscara Capilar": "Máscara capilar ozonizada para fios danificados. Força, proteção e cuidado intensivo com tratamento profundo.",
  "Linha Men 4 em 1": "Shampoo masculino 4 em 1 com shampoo, condicionador, espuma de barbear e sabonete em um único produto prático.",
  "Hidra Max Fase 1": "Shampoo profissional Hidra Max para preparação e limpeza profunda dos fios antes do tratamento de alinhamento.",
  "Hidra Max Fase 2": "Condicionador profissional Hidra Max para finalização, maciez e brilho após o processo de alinhamento capilar.",
  "Alinhamento Absoluto Fase 1": "Shampoo profissional para limpeza e abertura das cutículas. Prepara os fios para o alinhamento capilar.",
  "Alinhamento Absoluto Fase 2": "Tratamento profissional para alinhamento. Sela as cutículas, alinha e devolve brilho e maciez aos fios.",
  "Natuliso": "Natuliso de chuveiro sem formol e com ozônio. Alinha os fios, reduz frizz e repõe massa capilar com efeito liso.",
  "Ampola Crono Power Nutrição": "Ampola de nutrição com óleos de uva, coco e abacate. Nutrição intensiva, reparação, brilho e vitalidade capilar.",
  "Ampola Crono Power Reconstrução": "Ampola de reconstrução com óleos de uva, coco e abacate. Reconstrói, fortalece e revitaliza fios danificados.",
  "Óleo Finalizador": "Óleo finalizador com argan e ojon. Sela cutículas, controla frizz, protege do dano e confere brilho e maciez.",
  "Protetor Térmico": "Protetor térmico com queratina e óleo de cálamo. Protege do calor, reduz quebra, nutre e adiciona brilho.",
  "Ativador de Cachos": "Ativador de cachos com colágeno e argan. Define, hidrata, nutre e controla o frizz para cachos perfeitos.",
  "Balm Modelador": "Balm modelador para modelar, definir e controlar os fios. Acabamento natural e nutritivo para o dia a dia.",
  "Creme de Pentear": "Creme de pentear para facilitar o desembaraço, definir os fios e controlar o frizz com leveza e nutrição.",

  // COSMÉTICOS — SKIN CARE
  "BB Cream": "BB cream multifuncional com proteção solar, hidratação e cobertura leve. Pele uniforme e cuidada para o dia a dia.",
  "Máscara Facial": "Máscara facial de argila com espirulina ozonizada. Limpa os poros, controla oleosidade e cuida da pele.",
  "Água Micelar": "Água micelar com extrato de mirtilo. Remove maquiagem, hidrata e limpa suavemente protegendo a pele.",
  "Creme Hidratante": "Creme hidratante ozonizado com ácido hialurônico, rosa mosqueta e vitamina E. Hidratação e cuidado facial.",
  "Peeling": "Peeling de cristal ozonizado com esferas esfoliantes. Remove células mortas e promove renovação profunda da pele.",
  "Sabonete Facial": "Sabonete facial com óleo de amêndoas e ácido hialurônico. Limpeza profunda e pele hidratada após o uso.",
  "Mousse Facial": "Mousse de limpeza facial com extratos naturais. Limpa poros, refresca e protege contra impurezas diárias.",
  "Água Termal": "Água termal com minerais naturais. Hidrata, refresca, revitaliza e acalma a pele no uso diário.",
  "Sabonete Íntimo": "Sabonete íntimo Duo com aloe vera e hamamélis. Cuidado suave, sensação de frescor e equilíbrio da flora.",
  "Sabonete de Banho": "Sabonete de banho ozonizado com espuma cremosa. Limpeza profunda, hidratação e fragrância envolvente.",
  "Natuoz Gel Dental": "Gel dental de Aloe Vera sabor menta com mel. Limpeza bucal eficiente, hálito fresco e cuidado diário.",
  "Sabonete Antiacne": "Sabonete antiacne para controle da oleosidade, limpeza dos poros e redução das imperfeições da pele.",
  "Nanoxenol": "Produto para cuidado íntimo com ação protetora. Higiene, conforto e equilíbrio para a rotina de bem-estar.",
  "Desodorante em Creme": "Desodorante em creme ozonizado. Livre de alumínio, com proteção, frescor e cuidado das axilas.",
  "Natuoz Óleo Pés e Pernas": "Óleo ozonizado com aloe vera e arnica. Alivia cansaço, hidrata e protege pés e pernas no dia a dia.",
  "Hidratante para os Pés": "Hidratante especial para os pés com ação intensa. Amacia, hidrata e cuida da pele ressecada dos pés.",

  // LINHA CASA OZÔNIO
  "Limpador Multiuso Ultra Concentrado": "Multilimpador concentrado para diferentes superfícies. Alto rendimento, limpeza eficiente e perfume agradável.",
  "Lava-Roupas Ultra Concentrado": "Lava-roupas ultra concentrado. Remove sujeiras, manchas e odores dos tecidos com eficiência no dia a dia.",
  "Amaciante Ultra Concentrado": "Amaciante ultra concentrado para maciez intensa, perfume duradouro e cuidado especial com os tecidos.",
  "Lava-Louças Ultra Concentrado": "Lava-louças ultra concentrado com ação desengordurante. Remove gorduras de louças e superfícies laváveis.",
  "Odorizador Número 2": "Odorizador bloqueador de odores sanitários. Perfuma, neutraliza maus odores e mantém frescor no banheiro.",
  "Home Spray Bamboo Ultra Concentrado": "Home spray ultra concentrado com fragrância Bamboo. Perfuma ambientes com frescor, leveza e sensação de limpeza.",

  // EMAGRECIMENTO
  "Café Fibras": "Café com fibras natural para auxiliar no controle do apetite, bem-estar intestinal e rotina de emagrecimento.",
  "Slim Chá": "Chá Slim para auxiliar no metabolismo, bem-estar e complementar a rotina de controle de peso.",
  "Mais Leve Chá": "Chá Mais Leve para suporte ao emagrecimento, leveza e bem-estar no dia a dia.",
  "Mais Leve Comprimidos 120 Comp": "Suplemento Mais Leve em comprimidos. Apoia o controle de peso e complementa a rotina de emagrecimento.",
  "Detox": "Chá detox com ervas naturais. Auxilia na desintoxicação do organismo, bem-estar digestivo e leveza.",
  "Green": "Suplemento green com chlorella e ativos naturais. Desintoxica, apoia a imunidade e o bem-estar geral.",
  "Green Caps Vit C": "Green Caps com Vitamina C. Antioxidante, apoia a imunidade e complementa a rotina de saúde e vitalidade.",

  // LINHA ACADEMIA
  "Creatina": "Creatina monoidratada para suporte à força, ganho de massa muscular e desempenho físico nos treinos.",
  "Café Pré Treino": "Café pré-treino para energia, foco e disposição antes dos exercícios físicos.",
  "ATL Natural Pré Treino Ponche de Frutas": "Pré-treino sabor ponche de frutas. Energia, foco e disposição para maximizar o rendimento nos treinos.",
  "Glutamina em Pó": "Glutamina em pó para recuperação muscular, suporte à imunidade e bem-estar pós-treino.",
  "Mastigável Creatina Maçã Verde": "Creatina mastigável sabor maçã verde. Prática para suplementar, apoiar força e recuperação pós-treino.",
  "Picolinato de Cromo": "Picolinato de cromo para apoiar o equilíbrio alimentar e complementar a rotina nutricional.",
  "BCAA": "BCAA com aminoácidos essenciais para redução de fadiga, recuperação muscular e suporte ao desempenho.",
  "Colostro Bovino": "Colostro bovino rico em imunoglobulinas. Fortalece a imunidade, auxilia na recuperação e saúde intestinal.",
  "Creatina Monoidratada": "Creatina monoidratada pura para ganho de força, massa muscular e desempenho nos treinos.",
  "Moro Treiny": "Suplemento com extrato de laranja Moro para apoiar o emagrecimento, energia e desempenho físico.",
  "Natural Pré-Treino Café": "Pré-treino natural com café. Energia, foco e disposição para treinos mais intensos e produtivos.",
  "Creatina Mastigável": "Creatina mastigável para suplementar de forma prática e apoiar força e recuperação muscular.",
  "ZMA": "ZMA com zinco, magnésio e vitamina B6 para recuperação muscular, qualidade do sono e bem-estar.",

  // SUPLEMENTOS E NUTRACÊUTICOS
  "ATL Vision 30ml": "Suplemento ATL Vision em gotas para suporte à saúde visual, antioxidante e bem-estar no dia a dia.",
  "Colágeno Anti Age": "Colágeno anti-age para pele, cabelos e unhas. Firmeza, elasticidade e beleza de dentro para fora.",
  "Colágeno Hialurônico Cáps": "Colágeno com ácido hialurônico em cápsulas. Hidratação, firmeza da pele e suporte articular.",
  "Curcu Mais 30ml": "Curcumina em gotas com alta biodisponibilidade. Anti-inflamatório natural, antioxidante e suporte imunológico.",

  // VITAMINAS
  "Gotas ADEK": "Vitaminas A, D, E e K em gotas. Suporte à imunidade, saúde óssea, visão e absorção de nutrientes.",
  "Gotas de Vitamina D": "Vitamina D3 em gotas para imunidade, saúde óssea, humor e bem-estar geral.",
  "Gotas Vitamina B9": "Vitamina B9 (ácido fólico) em gotas. Suporte ao sistema nervoso, formação celular e saúde da gestante.",
  "Gotas Zinco": "Zinco em gotas para imunidade, pele, cabelos e suporte ao metabolismo no dia a dia.",
  "Imuni Kids": "Suplemento infantil para suporte à imunidade. Vitaminas e minerais para a saúde e desenvolvimento das crianças.",
  "Imunic - Vitamina C Gotas": "Vitamina C em gotas para imunidade, antioxidante, energia e proteção celular no dia a dia.",
  "ImuniPro": "Suplemento Imuni Pro para imunidade reforçada. Vitaminas e minerais para proteção e saúde no dia a dia.",
  "Ost Cálcio": "Cálcio + vitamina D3 para saúde óssea, prevenção de osteoporose e bem-estar dos ossos e articulações.",
  "Vitamina D3 2000UI": "Vitamina D3 2000UI para imunidade, saúde óssea, humor e equilíbrio do organismo.",
  "Vitamina D3 Mastigável": "Vitamina D3 mastigável para praticidade no dia a dia. Imunidade, saúde óssea e bem-estar geral.",
  "Vitamina D3+MK7": "Vitamina D3 + K2 MK7 para absorção de cálcio, saúde óssea, cardiovascular e imunidade.",
  "Vitamina K2 Gotas": "Vitamina K2 em gotas para saúde óssea, cardiovascular e absorção eficiente do cálcio.",
  "Zinco": "Zinco para imunidade, pele saudável, cabelos, unhas e suporte ao metabolismo e funções celulares.",
  "Cranberry Cápsulas": "Cranberry em cápsulas para saúde urinária, antioxidante e bem-estar do trato urinário.",
  "Magnésio Bisglicinato": "Magnésio bisglicinato de alta absorção. Relaxamento muscular, qualidade do sono e equilíbrio do sistema nervoso.",
  "Vitamina C Ácido Ascórbico Cáps": "Vitamina C pura em cápsulas para imunidade, antioxidante, colágeno e proteção celular.",

  // ÓLEOS ESSENCIAIS
  "OE Laranja Doce": "Óleo essencial de laranja doce para aromaterapia. Eleva o humor, alivia estresse e perfuma ambientes.",
  "OE Limão Siciliano": "Óleo essencial de limão siciliano purificante. Limpa ambientes, alivia tensões e promove energia.",
  "OE Menta": "Óleo essencial de menta para frescor, foco mental, alívio de dores de cabeça e aromaterapia.",
  "OE Melaleuca": "Óleo essencial de melaleuca com potente ação antibacteriana. Cuidado da pele e limpeza de ambientes.",
  "OE Lavanda": "Óleo essencial de lavanda para relaxamento, qualidade do sono, alívio do estresse e aromaterapia.",
  "OE Gerânio": "Óleo essencial de gerânio para equilíbrio emocional, cuidado da pele e aromaterapia.",
  "OE Alecrim": "Óleo essencial de alecrim para foco, memória, estímulo circulatório e aromaterapia.",
  "OE Eucalipto": "Óleo essencial de eucalipto para respiração, limpeza de ambientes e bem-estar.",
  "Óleo Essencial Menta Piperita": "Óleo essencial de menta piperita. Frescor intenso, foco mental e alívio de tensões no dia a dia.",

  // PERFUMES 100ML
  "Fragrância Angeli 100ml": "Fragrância Bortoletto inspirada em Angel Mugler. 100ml com essência de longa duração.",
  "Fragrância Crazy Love 100ml": "Fragrância Bortoletto inspirada em Chanel Nº5. 100ml com essência sofisticada e marcante.",
  "Fragrância Fantastic 100ml": "Fragrância Bortoletto inspirada em Fantasy Britney Spears. 100ml com essência doce e envolvente.",
  "Fragrância Esplêndida 100ml": "Fragrância Bortoletto inspirada em Scandal Jean Paul Gaultier. 100ml com essência sedutora.",
  "Fragrância La Bella 100ml": "Fragrância Bortoletto inspirada em La Vie Est Belle Lancôme. 100ml com essência floral e doce.",
  "Fragrância Euphoria 100ml": "Fragrância Bortoletto inspirada em Euphoria Calvin Klein. 100ml com essência floral e amadeirada.",
  "Fragrância Cloes 100ml": "Fragrância Bortoletto inspirada em Chloé. 100ml com essência delicada e elegante.",
  "Fragrância Fama 100ml": "Fragrância Bortoletto inspirada em Fame Paco Rabanne. 100ml com essência floral e frutal.",
  "Fragrância Very Summer 100ml": "Fragrância Bortoletto inspirada em Light Blue Dolce & Gabbana. 100ml com essência fresca.",
  "Fragrância Gabby 100ml": "Fragrância Bortoletto inspirada em Gabriela Sabatini. 100ml com essência clássica e feminina.",
  "Fragrância 521 Hera Vip 100ml": "Fragrância Bortoletto inspirada em 212 VIP Carolina Herrera. 100ml com essência sofisticada.",
  "Fragrância Giro Woman 100ml": "Fragrância Bortoletto inspirada em Good Girl Carolina Herrera. 100ml com essência intensa.",
  "Fragrância 521 Vip Rose 100ml": "Fragrância Bortoletto inspirada em 212 VIP Rosé Carolina Herrera. 100ml com essência rosada.",
  "Fragrância Idoll 100ml": "Fragrância Bortoletto inspirada em Idôle Lancôme. 100ml com essência floral e moderna.",
  "Fragrância Luxuria 100ml": "Fragrância Bortoletto inspirada em La Nuit Trésor Lancôme. 100ml com essência noturna.",
  "Fragrância Amore Mio 100ml": "Fragrância Bortoletto inspirada em J'adore Dior. 100ml com essência floral e sofisticada.",
  "Fragrância Madeleine 100ml": "Fragrância Bortoletto inspirada em Coco Mademoiselle Chanel. 100ml com essência elegante.",
  "Fragrância Vênus 100ml": "Fragrância Bortoletto inspirada em CH Carolina Herrera. 100ml com essência floral e feminina.",
  "Fragrância Miss Charm 100ml": "Fragrância Bortoletto inspirada em Miss Dior. 100ml com essência delicada e romântica.",
  "Fragrância 521 Vip Black 100ml": "Fragrância Bortoletto inspirada em 212 VIP Black Carolina Herrera. 100ml masculina.",
  "Fragrância Fortune 100ml": "Fragrância Bortoletto inspirada em One Million Paco Rabanne. 100ml com essência intensa.",
  "Fragrância Scent 100ml": "Fragrância Bortoletto inspirada em CH Men Carolina Herrera. 100ml com essência masculina.",
  "Fragrância Rouge 100ml": "Fragrância Bortoletto inspirada em Baccarat Rouge 540. 100ml com essência sofisticada.",
  "Fragrância 521 Number Men 100ml": "Fragrância Bortoletto inspirada em 212 Men Carolina Herrera. 100ml masculina e urbana.",
  "Fragrância 521 Vip Men 100ml": "Fragrância Bortoletto inspirada em 212 VIP Men Carolina Herrera. 100ml masculina.",
  "Fragrância Aqua For Men 100ml": "Fragrância Bortoletto inspirada em Acqua di Giò Armani. 100ml com essência fresca.",
  "Fragrância Black Privat 100ml": "Fragrância Bortoletto inspirada em Armani Code. 100ml com essência masculina sofisticada.",
  "Fragrância Blackout Silver 100ml": "Fragrância Bortoletto inspirada em Silver Scent Jacques Bogart. 100ml masculina.",
  "Fragrância Champion 100ml": "Fragrância Bortoletto inspirada em Azzaro Pour Homme. 100ml clássica e masculina.",
  "Fragrância Dark Bloom 100ml": "Fragrância Bortoletto inspirada em Bleu de Chanel. 100ml com essência elegante e fresca.",
  "Fragrância Invictus 100ml": "Fragrância Bortoletto inspirada em Invictus Paco Rabanne. 100ml com essência esportiva.",
  "Fragrância Indomável 100ml": "Fragrância Bortoletto inspirada em Sauvage Dior. 100ml com essência selvagem e intensa.",
  "Fragrância Khalifa 100ml": "Fragrância Bortoletto inspirada em Animale For Men. 100ml com essência masculina marcante.",
  "Fragrância Phamous 100ml": "Fragrância Bortoletto inspirada em Phantom Paco Rabanne. 100ml com essência moderna.",
  "Fragrância Play Men 100ml": "Fragrância Bortoletto inspirada em Bad Boy Carolina Herrera. 100ml com essência ousada.",
  "Fragrância Polo Club 100ml": "Fragrância Bortoletto inspirada em Polo Blue Ralph Lauren. 100ml com essência fresca.",
  "Fragrância Racing Car 100ml": "Fragrância Bortoletto inspirada em Ferrari Black. 100ml com essência masculina intensa.",
  "Fragrância The Boss 100ml": "Fragrância Bortoletto inspirada em Hugo Boss. 100ml com essência elegante e masculina.",
  "Fragrância Zeus 100ml": "Fragrância Bortoletto inspirada em Polo Green Ralph Lauren. 100ml clássica e masculina.",
};

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function main() {
  const products = await db.product.findMany({
    where: { company: { slug: "atlantica" } },
  });

  console.log(`📦 ${products.length} produtos encontrados`);

  let updated = 0;
  const notFound: string[] = [];

  for (const [name, description] of Object.entries(DESCRIPTIONS)) {
    const matched = products.filter((p) =>
      normalize(p.name) === normalize(name)
    );

    if (matched.length === 0) {
      notFound.push(name);
      continue;
    }

    for (const p of matched) {
      await db.product.update({
        where: { id: p.id },
        data: { description },
      });
      console.log(`✅ ${p.name}`);
      updated++;
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`✅ ${updated} produtos com descrição atualizada`);
  if (notFound.length > 0) {
    console.log(`⚠️  ${notFound.length} sem match:`);
    notFound.forEach((n) => console.log(`   - ${n}`));
  }

  await db.$disconnect();
}

main();
