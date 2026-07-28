-- Migration: update_perfil_6_perfis
-- Substitui o enum LeadPerfil de 5 para 6 perfis, adiciona apenas_consumir ao LeadCaminho
-- e adiciona campos interesse_principal e maior_trava.

-- 1. Adicionar apenas_consumir ao LeadCaminho (operação segura, não remove nada)
ALTER TYPE "LeadCaminho" ADD VALUE IF NOT EXISTS 'apenas_consumir';

-- 2. Adicionar novos campos de texto (nullable, não quebra dados existentes)
ALTER TABLE "renda_inteligente_leads" ADD COLUMN IF NOT EXISTS "interesse_principal" TEXT;
ALTER TABLE "renda_inteligente_leads" ADD COLUMN IF NOT EXISTS "maior_trava" TEXT;

-- 3. Migrar LeadPerfil: remover 5 valores antigos, criar 6 novos
-- Passo a: converter coluna para TEXT temporariamente para liberar o enum
ALTER TABLE "renda_inteligente_leads" ALTER COLUMN "perfil_resultante" TYPE TEXT;

-- Passo b: remover enum antigo
DROP TYPE IF EXISTS "LeadPerfil";

-- Passo c: criar novo enum com 6 perfis
CREATE TYPE "LeadPerfil" AS ENUM (
  'consumidor_curioso',
  'renda_extra_inicial',
  'vendedor_em_evolucao',
  'construtor_equipe',
  'empreendedor_servicos',
  'perfil_premium'
);

-- Passo d: mapear dados existentes para novos valores
UPDATE "renda_inteligente_leads" SET "perfil_resultante" =
  CASE "perfil_resultante"
    WHEN 'iniciante_urgente'    THEN 'renda_extra_inicial'
    WHEN 'sonhador_cauteloso'   THEN 'renda_extra_inicial'
    WHEN 'investidor_pronto'    THEN 'perfil_premium'
    WHEN 'vendedor_em_evolucao' THEN 'vendedor_em_evolucao'
    WHEN 'tempo_limitado'       THEN 'renda_extra_inicial'
    ELSE                             'renda_extra_inicial'
  END;

-- Passo e: restaurar coluna para o novo enum
ALTER TABLE "renda_inteligente_leads"
  ALTER COLUMN "perfil_resultante" TYPE "LeadPerfil"
  USING "perfil_resultante"::"LeadPerfil";
