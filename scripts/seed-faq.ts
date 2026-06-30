import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 });
const db = new PrismaClient({ adapter });

async function main() {
  // PASSO 1 — buscar company
  const company = await db.company.findUnique({ where: { slug: "atlantica" } });
  if (!company) throw new Error("Company 'atlantica' não encontrada");
  console.log("✅ company_id:", company.id);

  // PASSO 2 — inserir 9 itens de FAQ
  const faqs = [
    {
      title: "Como funciona o catálogo online?",
      content: "Seu catálogo fica disponível 24h em um link personalizado. Você compartilha esse link com seus clientes pelo WhatsApp e eles podem ver os produtos, fazer pedidos e entrar em contato direto com você.",
      sort_order: 1,
    },
    {
      title: "Como recebo minhas comissões?",
      content: "Você compra os produtos com preço de consultor(a) e revende pelo preço cliente. A diferença entre os dois valores é o seu lucro, recebido no momento da entrega.",
      sort_order: 2,
    },
    {
      title: "Como funcionam os cupons?",
      content: "Cupons ativam o catálogo de novos consultores por um período determinado (7 dias ou 1 ano). Você pode comprar packs de cupons e distribuir para sua equipe.",
      sort_order: 3,
    },
    {
      title: "Posso vender o catálogo para minha equipe?",
      content: "Sim, você pode comprar cupons com 50% de desconto e repassar para a sua equipe. A diferença do valor é o seu lucro.",
      sort_order: 4,
    },
    {
      title: "Como compro mais cupons?",
      content: "Acesse a aba \"Cupons\" no seu painel e siga as instruções de pagamento via PIX. Após o pagamento, seu pack será liberado pelo administrador.",
      sort_order: 5,
    },
    {
      title: "Posso personalizar meu catálogo?",
      content: "Sim! Em \"Meu Perfil\" você pode alterar foto, bio, WhatsApp, redes sociais e o link personalizado da sua loja.",
      sort_order: 6,
    },
    {
      title: "O que é o Cartão Virtual?",
      content: "É uma página com seus dados de contato e redes sociais, ideal para compartilhar como visita digital.",
      sort_order: 7,
    },
    {
      title: "Como funciona o catálogo de desconto?",
      content: "A página /desconto mostra os produtos com 50% de desconto, ideal para você comprar para uso próprio ou revenda com maior margem.",
      sort_order: 8,
    },
    {
      title: "Minha assinatura vai expirar, o que acontece?",
      content: "Seu catálogo continua visível, mas com um aviso de renovação. Para reativar, use um cupom ou entre em contato com o administrador.",
      sort_order: 9,
    },
  ];

  let inseridos = 0;
  for (const faq of faqs) {
    await db.panelContent.create({
      data: {
        company_id: company.id,
        type: "FAQ",
        title: faq.title,
        content: faq.content,
        sort_order: faq.sort_order,
        active: true,
      },
    });
    console.log(`  ✅ FAQ ${faq.sort_order}: "${faq.title}"`);
    inseridos++;
  }

  console.log(`\n🎉 Concluído! ${inseridos} item(s) de FAQ inserido(s).`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error("❌ Erro:", e.message ?? e);
  process.exit(1);
});
