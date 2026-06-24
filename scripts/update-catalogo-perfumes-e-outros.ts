import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter } as any);

const femininos = [
  "Fragrância 521 Hera Vip 15ml",
  "Fragrância 521 Sexy's 15ml",
  "Fragrância 521 Vip Rose 15ml",
  "Fragrância 521 Sexy's 100ml",
  "Fragrância 521 Vip Rose 100ml",
  "Fragrância Amore Mio 100ml",
  "Fragrância Angeli 15ml",
  "Fragrância Athenna 15ml",
  "Fragrância Athenna 100ml",
  "Fragrância Bali 15ml",
  "Fragrância Bali 100ml",
  "Fragrância Cloes 15ml",
  "Fragrância Crazy Love 15ml",
  "Fragrância Esplêndida 15ml",
  "Fragrância Euphorica 15ml",
  "Fragrância Euphorica 100ml",
  "Fragrância F. Lavina 15ml",
  "Fragrância F. Lavina 100ml",
  "Fragrância Fama 15ml",
  "Fragrância Fantastic 15ml",
  "Fragrância For You 15ml",
  "Fragrância For You 100ml",
  "Fragrância Gabby 15ml",
  "Fragrância Good Woman 15ml",
  "Fragrância Good Woman 100ml",
  "Fragrância Idoll 15ml",
  "Fragrância La Bella 15ml",
  "Fragrância Love Me 15ml",
  "Fragrância Loved 15ml",
  "Fragrância Loved 100ml",
  "Fragrância Luxuria 15ml",
  "Fragrância Madeleine 15ml",
  "Fragrância Miss Charm 15ml",
  "Fragrância Phakar Rose 15ml",
  "Fragrância Phakar Rose 100ml",
  "Fragrância Rouge 15ml",
  "Fragrância Royale 15ml",
  "Fragrância Royale 100ml",
  "Fragrância Vênus 15ml",
  "Fragrância Very Summer 15ml",
  "Fragrância Yaha 15ml",
  "Fragrância Yaha 100ml",
];

const masculinos = [
  "Fragrância 521 Number Men 15ml",
  "Fragrância 521 Vip Black 15ml",
  "Fragrância 521 Vip Men 15ml",
  "Fragrância Al-Asad 15ml",
  "Fragrância Al-Asad 100ml",
  "Fragrância Black Privat 15ml",
  "Fragrância Blackout Silver 15ml",
  "Fragrância Champion 15ml",
  "Fragrância Club For Men 15ml",
  "Fragrância Club For Men 100ml",
  "Fragrância Dark Bloom 15ml",
  "Fragrância Fortune 15ml",
  "Fragrância Imortal 15ml",
  "Fragrância Imortal 100ml",
  "Fragrância Imortal Black 15ml",
  "Fragrância Imortal Black 100ml",
  "Fragrância Indomável 15ml",
  "Fragrância J Alphaa 15ml",
  "Fragrância J Alphaa 100ml",
  "Fragrância Khalifa 15ml",
  "Fragrância Match 15ml",
  "Fragrância Match 100ml",
  "Fragrância Phamous 15ml",
  "Fragrância Phakar Black 15ml",
  "Fragrância Phakar Black 100ml",
  "Fragrância Play Men 15ml",
  "Fragrância Polo Club 15ml",
  "Fragrância Racing Car 15ml",
  "Fragrância Scent 15ml",
  "Fragrância The Boss 15ml",
  "Fragrância Zeus 15ml",
];

const outros: Record<string, string> = {
  "Gel Extra Forte Massagem": "11.jpg",
  "Hidratante Corporal Ozonizado 200ml": "2.jpg",
  "Depilskin Creme Depilatório": "10.jpg",
  "Esfoliante Corporal 250ml": "51.jpg",
  "Protetor Solar Corporal FPS30 180ml": "51.jpg",
  "Protetor Solar Facial FPS60 60ml": "51.jpg",
  "Dermo - Creme Rosto Hidratante Ozonizado": "5.jpg",
  "Dermo - Máscara Argila Ozonizado": "5.jpg",
  "Sérum Colágeno 18ml": "50.jpg",
  "Sérum Hialurônico 18ml": "50.jpg",
  "Sérum Niacinamida 18ml": "50.jpg",
  "Sérum Vitamina C 18ml": "50.jpg",
  "Shampoo Nutritivo": "7.jpg",
  "Shampoo Reconstrutor": "6.jpg",
  "Shampoo Ouro 250ml": "6.jpg",
  "Shampoo 4 em 1": "6.jpg",
  "Condicionador Nutritivo": "7.jpg",
  "Condicionador Reconstrutor": "6.jpg",
  "Condicionador Ouro 250ml": "6.jpg",
  "Máscara Hidratante": "7.jpg",
  "Máscara Ouro 250g": "6.jpg",
  "Kit Shampoo + Condicionador Ozonizado": "6.jpg",
  "ATL Natural Pré Treino Ponche de Frutas": "42.jpg",
  "Glutamina em Pó": "42.jpg",
  "Imunic - Vitamina C Gotas": "34.jpg",
  "Magnésio Bisglicinato": "34.jpg",
  "Vitamina C Ácido Ascórbico Cáps": "34.jpg",
  "Cranberry Cápsulas": "34.jpg",
  "Óleo Essencial Menta Piperita": "40.jpg",
  "ATL Vision 30ml": "31.jpg",
  "Amaciante Ultra Concentrado": "9.jpg",
  "Home Spray Bamboo Ultra Concentrado": "9.jpg",
  "Lava-Louças Ultra Concentrado": "9.jpg",
  "Lava-Roupas Ultra Concentrado": "9.jpg",
  "Limpador Multiuso Ultra Concentrado": "9.jpg",
  "Odorizador Número 2": "9.jpg",
  "Pasta Dental Creme Novo 90g": "9.jpg",
};

async function main() {
  let atualizados = 0;

  for (const nome of femininos) {
    const r = await db.product.updateMany({
      where: { name: nome },
      data: { catalog_page_file: "perfumes-femininos-15ml.jpg" },
    });
    if (r.count > 0) { atualizados++; console.log(`✓ [F] ${nome}`); }
    else console.log(`⚠️ Não encontrado: ${nome}`);
  }

  for (const nome of masculinos) {
    const r = await db.product.updateMany({
      where: { name: nome },
      data: { catalog_page_file: "perfumes-masculinos-15-ml.jpg" },
    });
    if (r.count > 0) { atualizados++; console.log(`✓ [M] ${nome}`); }
    else console.log(`⚠️ Não encontrado: ${nome}`);
  }

  for (const [nome, arquivo] of Object.entries(outros)) {
    const r = await db.product.updateMany({
      where: { name: nome },
      data: { catalog_page_file: arquivo },
    });
    if (r.count > 0) { atualizados++; console.log(`✓ ${nome} → ${arquivo}`); }
    else console.log(`⚠️ Não encontrado: ${nome}`);
  }

  console.log(`\n✅ ${atualizados} produtos atualizados`);
  await db.$disconnect();
  await pool.end();
}

main().catch(console.error);
