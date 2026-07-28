import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter } as never);

const TEMPLATES = [
  { kanban: "novo_contato",          mensagem: "Oi [NOME]! Vi que você acabou de fazer o Plano Renda Inteligente. Bora bater um papo rápido sobre o que faz mais sentido pra você?" },
  { kanban: "diagnostico_interesse", mensagem: "Aqui no seu diagnóstico, seu perfil ficou como [PERFIL]. Faz sentido pra você? Posso te explicar melhor como isso funcionaria no seu caso." },
  { kanban: "qualificado",           mensagem: "Baseado no que você respondeu, o caminho recomendado pra você é [CAMINHO] em [MODALIDADE]. Quer que eu te mostre como começar?" },
  { kanban: "oferta_decisao",        mensagem: "Separei os detalhes do plano recomendado pra você: [LINK_RESULTADO]. Qualquer dúvida, me chama por aqui." },
  { kanban: "agendamento",           mensagem: "Bora marcar uma conversa rápida pra eu te mostrar como isso funcionaria na prática? Me diz um horário que funciona pra você." },
  { kanban: "compra_fechamento",     mensagem: "Perfeito! Aqui está o link para finalizar sua assinatura: [LINK_RESULTADO]. Qualquer dúvida no processo, me chama." },
  { kanban: "cliente_ativo",         mensagem: "Bem-vindo(a)! Vamos começar sua implantação — me conta um pouco mais sobre o seu momento pra eu te ajudar melhor." },
  { kanban: "suporte",               mensagem: "Oi [NOME], tudo bem? Me conta o que está acontecendo que já te ajudo." },
  { kanban: "resolvido_arquivado",   mensagem: "Ficamos à disposição se quiser retomar isso depois. Qualquer coisa, me chama." },
];

async function main() {
  const companies = await db.company.findMany({ select: { id: true, slug: true } });

  if (companies.length === 0) {
    console.log("Nenhuma empresa encontrada.");
    return;
  }

  for (const company of companies) {
    let created = 0;
    let skipped = 0;
    for (const t of TEMPLATES) {
      const result = await db.kanbanMessageTemplate.upsert({
        where: { company_id_kanban: { company_id: company.id, kanban: t.kanban } },
        update: {},
        create: { company_id: company.id, kanban: t.kanban, mensagem: t.mensagem },
      });
      if (result.updated_at.getTime() === result.updated_at.getTime()) {
        created++;
      } else {
        skipped++;
      }
    }
    console.log(`✓ ${company.slug}: ${TEMPLATES.length} templates upserted`);
  }
}

main()
  .then(() => { console.log("Seed concluído."); db.$disconnect(); })
  .catch((e) => { console.error(e); db.$disconnect(); process.exit(1); });
