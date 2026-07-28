-- CreateEnum
CREATE TYPE "LeadCaminho" AS ENUM ('produto', 'servico', 'indeciso');

-- CreateEnum
CREATE TYPE "LeadModalidade" AS ENUM ('digital', 'presencial', 'misto');

-- CreateEnum
CREATE TYPE "LeadPerfil" AS ENUM ('iniciante_urgente', 'sonhador_cauteloso', 'investidor_pronto', 'vendedor_em_evolucao', 'tempo_limitado');

-- CreateEnum
CREATE TYPE "LeadKanban" AS ENUM ('novo_contato', 'diagnostico_interesse', 'qualificado', 'oferta_decisao', 'agendamento', 'compra_fechamento', 'cliente_ativo', 'suporte', 'resolvido_arquivado');

-- CreateTable
CREATE TABLE "renda_inteligente_leads" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "caminho" "LeadCaminho" NOT NULL,
    "modalidade" "LeadModalidade" NOT NULL,
    "area_atual" TEXT,
    "gap_renda" TEXT,
    "meta_mensal" TEXT,
    "horas_disponiveis" TEXT,
    "renda_familiar" TEXT,
    "capacidade_investimento" TEXT,
    "experiencia_vendas" TEXT,
    "motivacao_dominante" TEXT,
    "canal_preferido" TEXT,
    "perfil_resultante" "LeadPerfil" NOT NULL,
    "dor_principal" TEXT,
    "desejo_dominante" TEXT,
    "medo_principal" TEXT,
    "objecao_provavel" TEXT,
    "prova_necessaria" TEXT,
    "pitch_sugerido" TEXT,
    "material_indicado" TEXT,
    "evitar" TEXT,
    "kanban" "LeadKanban" NOT NULL DEFAULT 'novo_contato',
    "score" INTEGER,
    "respostas" JSONB NOT NULL DEFAULT '{}',
    "source" TEXT,
    "user_agent" TEXT,
    "page_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "renda_inteligente_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "renda_inteligente_leads_codigo_key" ON "renda_inteligente_leads"("codigo");

-- CreateIndex
CREATE INDEX "renda_inteligente_leads_company_id_idx" ON "renda_inteligente_leads"("company_id");

-- CreateIndex
CREATE INDEX "renda_inteligente_leads_seller_id_idx" ON "renda_inteligente_leads"("seller_id");

-- CreateIndex
CREATE INDEX "renda_inteligente_leads_kanban_idx" ON "renda_inteligente_leads"("kanban");

-- CreateIndex
CREATE INDEX "renda_inteligente_leads_created_at_idx" ON "renda_inteligente_leads"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "renda_inteligente_leads" ADD CONSTRAINT "renda_inteligente_leads_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renda_inteligente_leads" ADD CONSTRAINT "renda_inteligente_leads_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
