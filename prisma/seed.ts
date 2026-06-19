import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const company = await db.company.upsert({
    where: { slug: "atlantica" },
    update: {},
    create: { slug: "atlantica", name: "Atlântica" },
  });

  const password_hash = await hash("admin123", 10);

  await db.user.upsert({
    where: { email: "admin@lojah.app" },
    update: {},
    create: {
      email: "admin@lojah.app",
      password_hash,
      role: "SUPERADMIN",
    },
  });

  console.log(`Empresa "${company.name}" (slug: ${company.slug}) pronta.`);
  console.log("Usuário superadmin admin@lojah.app pronto.");

  // Remove qualquer vendedor de teste antigo com slug "brunocaio"
  const staleSellers = await db.sellerProfile.findMany({
    where: { slug: "brunocaio" },
  });

  for (const stale of staleSellers) {
    await db.subscription.deleteMany({ where: { seller_id: stale.id } });
    await db.coupon.updateMany({
      where: { used_by: stale.id },
      data: { used_by: null, used_at: null },
    });
    await db.sellerProfile.delete({ where: { id: stale.id } });
    await db.user.delete({ where: { id: stale.user_id } });
    console.log(`Vendedor de teste "brunocaio" (${stale.id}) removido.`);
  }

  // Vendedor: Rodolfo Gasparian (slug "mentoriar"), na empresa Atlântica
  const sellerPasswordHash = await hash("senha123", 10);

  const sellerUser = await db.user.upsert({
    where: { email: "renda10online@gmail.com" },
    update: {
      role: "SELLER",
      company_id: company.id,
      password_hash: sellerPasswordHash,
    },
    create: {
      email: "renda10online@gmail.com",
      role: "SELLER",
      company_id: company.id,
      password_hash: sellerPasswordHash,
    },
  });

  const sellerProfile = await db.sellerProfile.upsert({
    where: { user_id: sellerUser.id },
    update: {
      company_id: company.id,
      slug: "mentoriar",
      name: "Rodolfo Gasparian",
    },
    create: {
      user_id: sellerUser.id,
      company_id: company.id,
      slug: "mentoriar",
      name: "Rodolfo Gasparian",
    },
  });

  const activatedAt = new Date();
  const expiresAt = new Date(activatedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Subscription não tem chave única em seller_id, então o "upsert" é manual:
  // atualiza a assinatura ativa existente, ou cria uma nova.
  const existingSubscription = await db.subscription.findFirst({
    where: { seller_id: sellerProfile.id, status: "ACTIVE" },
  });

  if (existingSubscription) {
    await db.subscription.update({
      where: { id: existingSubscription.id },
      data: { status: "ACTIVE", activated_at: activatedAt, expires_at: expiresAt },
    });
  } else {
    await db.subscription.create({
      data: {
        seller_id: sellerProfile.id,
        status: "ACTIVE",
        activated_at: activatedAt,
        expires_at: expiresAt,
      },
    });
  }

  console.log(
    `Vendedor "${sellerProfile.name}" (slug: ${sellerProfile.slug}) pronto, com assinatura ativa até ${expiresAt.toLocaleDateString("pt-BR")}.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
