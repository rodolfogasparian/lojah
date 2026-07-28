"use server";

import { db } from "@/lib/db";
import { LeadCaminho, LeadKanban, LeadModalidade, LeadPerfil } from "@prisma/client";

const DEVOLUTIVA: Record<
  LeadPerfil,
  {
    dor_principal: string;
    desejo_dominante: string;
    medo_principal: string;
    objecao_provavel: string;
    prova_necessaria: string;
    pitch_sugerido: string;
    material_indicado: string;
    evitar: string;
  }
> = {
  iniciante_urgente: {
    dor_principal: "A renda atual não cobre as contas.",
    desejo_dominante: "Ver dinheiro entrando o quanto antes.",
    medo_principal: "Começar, se esforçar e não ver resultado rápido o suficiente.",
    objecao_provavel: "Não tenho tempo/paciência para aprender algo complicado agora.",
    prova_necessaria: "Caso de alguém que começou do zero e teve o primeiro resultado em poucos dias/semanas.",
    pitch_sugerido: "Você não precisa de um plano de longo prazo agora — precisa do caminho mais curto até o primeiro dinheiro entrando.",
    material_indicado: "Vídeo curto de depoimento + passo a passo simplificado (3 passos).",
    evitar: "Linguagem de 'construir um negócio' ou prazo maior que 30 dias para o primeiro resultado.",
  },
  sonhador_cauteloso: {
    dor_principal: "Sente que está estagnado(a), mas trava na hora de agir por medo do erro.",
    desejo_dominante: "Ter uma alternativa real e segura ao emprego atual.",
    medo_principal: "Investir e descobrir depois que 'não era bem assim'.",
    objecao_provavel: "Isso realmente funciona? Já vi promessa parecida antes.",
    prova_necessaria: "Depoimentos reais, FAQ transparente, simulação sem compromisso.",
    pitch_sugerido: "Você não precisa decidir tudo hoje. O plano foi pensado para você começar pequeno, ver funcionando e só então crescer.",
    material_indicado: "FAQ + vídeo de prova social + comparativo antes/depois.",
    evitar: "Pressão de urgência ('só hoje') e ausência de prova.",
  },
  investidor_pronto: {
    dor_principal: "Sente que está deixando dinheiro/tempo na mesa por não ter um sistema estruturado.",
    desejo_dominante: "Escalar, ter um ecossistema (produtos + serviços) funcionando com previsibilidade.",
    medo_principal: "Investir e não conseguir controlar ou escalar o que foi montado.",
    objecao_provavel: "Isso realmente vale o preço, comparado a outras opções do mercado?",
    prova_necessaria: "Comparativo de planos, números/ROI, cases de quem já escalou.",
    pitch_sugerido: "Seu perfil já tem o que a maioria não tem: capacidade de investir. O plano completo foi desenhado para quem quer construir um ecossistema.",
    material_indicado: "Comparativo de planos + case de escala + proposta de agendamento.",
    evitar: "Tratar como iniciante; simplificar demais a oferta.",
  },
  vendedor_em_evolucao: {
    dor_principal: "Perde vendas por falta de organização, follow-up ou processo.",
    desejo_dominante: "Ter um sistema (funil, CRM, acompanhamento) que sustente o crescimento que já começou.",
    medo_principal: "Continuar no 'improviso' e ver a concorrência ultrapassar.",
    objecao_provavel: "Eu já faço isso sozinho(a), não sei se preciso de mais uma ferramenta.",
    prova_necessaria: "Comparativo antes/depois de quem estruturou o processo e vendeu mais com o mesmo esforço.",
    pitch_sugerido: "Você já sabe vender. O que falta é estrutura para não perder o que já está gerando.",
    material_indicado: "Vídeo sobre organização/CRM + case de quem estruturou e vendeu mais.",
    evitar: "Discurso de 'comece do zero' — esse perfil já vende, quer evolução.",
  },
  tempo_limitado: {
    dor_principal: "Quer renda extra, mas não tem tempo/energia sobrando.",
    desejo_dominante: "Um ganho real, mesmo que modesto, sem comprometer a rotina.",
    medo_principal: "Assumir mais uma coisa e não conseguir sustentar por falta de tempo.",
    objecao_provavel: "Eu não vou dar conta de fazer isso todo dia.",
    prova_necessaria: "Exemplo de alguém com rotina cheia que conseguiu encaixar poucos minutos por dia.",
    pitch_sugerido: "O plano para o seu perfil foi desenhado para caber em poucos minutos por dia — sem prometer o que sua rotina não permite.",
    material_indicado: "Rotina simplificada (checklist diário curto) + depoimento de alguém com pouco tempo.",
    evitar: "Prometer ganhos altos sem deixar claro o esforço/tempo necessário.",
  },
};

const CAMINHO_MAP: Record<string, LeadCaminho> = {
  "Vender Produtos": LeadCaminho.produto,
  "Vender Serviços": LeadCaminho.servico,
  "Produtos e Serviços": LeadCaminho.ambos,
  "Ainda não sei (me ajude a decidir)": LeadCaminho.indeciso,
};

const MODALIDADE_MAP: Record<string, LeadModalidade> = {
  "100% Digital": LeadModalidade.digital,
  "Presencial na minha região": LeadModalidade.presencial,
  "Misto (digital + presencial)": LeadModalidade.misto,
};

function calcularPerfil(a: {
  horas_disponiveis?: string;
  experiencia_vendas?: string;
  capacidade_investimento?: string;
  renda_familiar?: string;
  motivacao_dominante?: string;
  gap_renda?: string;
}): LeadPerfil {
  if (a.horas_disponiveis === "Até 1h") return LeadPerfil.tempo_limitado;
  if (a.experiencia_vendas === "Já vendo hoje, quero crescer") return LeadPerfil.vendedor_em_evolucao;
  if (
    ["R$1.000 a R$3.000", "Acima de R$3.000"].includes(a.capacidade_investimento ?? "") &&
    ["R$5.000 a R$10.000", "Acima de R$10.000"].includes(a.renda_familiar ?? "")
  )
    return LeadPerfil.investidor_pronto;
  if (
    a.motivacao_dominante === "Preciso de dinheiro rápido" &&
    ["Não cobre", "Estou no vermelho"].includes(a.gap_renda ?? "")
  )
    return LeadPerfil.iniciante_urgente;
  return LeadPerfil.sonhador_cauteloso;
}

async function gerarCodigo(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = "RI-";
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    const exists = await db.rendaInteligenteLeads.findUnique({ where: { codigo: code } });
    if (!exists) return code;
  }
  throw new Error("Não foi possível gerar código único.");
}

export type CreateLeadInput = {
  company_id: string;
  seller_id: string;
  nome: string;
  email: string;
  whatsapp: string;
  caminho: string;
  modalidade: string;
  area_atual?: string;
  gap_renda?: string;
  meta_mensal?: string;
  horas_disponiveis?: string;
  renda_familiar?: string;
  capacidade_investimento?: string;
  experiencia_vendas?: string;
  motivacao_dominante?: string;
  canal_preferido?: string;
  source?: string;
  user_agent?: string;
  page_url?: string;
};

export async function criarLead(input: CreateLeadInput): Promise<{ codigo: string }> {
  const perfil = calcularPerfil({
    horas_disponiveis: input.horas_disponiveis,
    experiencia_vendas: input.experiencia_vendas,
    capacidade_investimento: input.capacidade_investimento,
    renda_familiar: input.renda_familiar,
    motivacao_dominante: input.motivacao_dominante,
    gap_renda: input.gap_renda,
  });

  const devolutiva = DEVOLUTIVA[perfil];
  const codigo = await gerarCodigo();

  await db.rendaInteligenteLeads.create({
    data: {
      company_id: input.company_id,
      seller_id: input.seller_id,
      codigo,
      nome: input.nome,
      whatsapp: input.whatsapp,
      email: input.email || undefined,
      caminho: CAMINHO_MAP[input.caminho] ?? LeadCaminho.indeciso,
      modalidade: MODALIDADE_MAP[input.modalidade] ?? LeadModalidade.misto,
      area_atual: input.area_atual,
      gap_renda: input.gap_renda,
      meta_mensal: input.meta_mensal,
      horas_disponiveis: input.horas_disponiveis,
      renda_familiar: input.renda_familiar,
      capacidade_investimento: input.capacidade_investimento,
      experiencia_vendas: input.experiencia_vendas,
      motivacao_dominante: input.motivacao_dominante,
      canal_preferido: input.canal_preferido,
      perfil_resultante: perfil,
      ...devolutiva,
      kanban: LeadKanban.novo_contato,
      respostas: {
        caminho: input.caminho,
        modalidade: input.modalidade,
        area_atual: input.area_atual,
        gap_renda: input.gap_renda,
        meta_mensal: input.meta_mensal,
        horas_disponiveis: input.horas_disponiveis,
        renda_familiar: input.renda_familiar,
        capacidade_investimento: input.capacidade_investimento,
        experiencia_vendas: input.experiencia_vendas,
        motivacao_dominante: input.motivacao_dominante,
        canal_preferido: input.canal_preferido,
      },
      source: input.source,
      user_agent: input.user_agent,
      page_url: input.page_url,
    },
  });

  return { codigo };
}
