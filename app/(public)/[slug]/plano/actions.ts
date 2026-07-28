"use server";

import { db } from "@/lib/db";
import { LeadCaminho, LeadKanban, LeadModalidade, LeadPerfil } from "@prisma/client";

// ── Devolutivas dos 6 perfis ──────────────────────────────────────────────────

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
  consumidor_curioso: {
    dor_principal: "Quer produtos de qualidade mas não sabe se quer se comprometer com revenda ainda.",
    desejo_dominante: "Comprar bem, com desconto, sem compromisso de vender.",
    medo_principal: "Ser empurrado(a) pra uma oportunidade de negócio que não pediu.",
    objecao_provavel: "Eu só quero comprar, não quero vender nada.",
    prova_necessaria: "Catálogo real, preço de consultor(a), sem letra miúda.",
    pitch_sugerido: "Sem problema — você pode simplesmente comprar com preço de consultor(a), sem nenhum compromisso de revenda. Se um dia quiser ganhar com isso, o caminho já vai estar aberto.",
    material_indicado: "Link do catálogo, sem falar de revenda.",
    evitar: "Insistir em oportunidade de negócio logo de cara.",
  },
  renda_extra_inicial: {
    dor_principal: "Quer ganhar dinheiro extra mas tem pouco tempo e nenhuma experiência de venda.",
    desejo_dominante: "Começar a ganhar algo, mesmo que pequeno, sem complicação.",
    medo_principal: "Começar, se esforçar e não ver resultado rápido o suficiente.",
    objecao_provavel: "Eu nunca vendi nada, não sei se consigo.",
    prova_necessaria: "Caso de alguém que começou do zero, sem experiência.",
    pitch_sugerido: "Você não precisa saber vender pra começar — o caminho mais simples é revender produtos que as pessoas já compram, com orientação passo a passo.",
    material_indicado: "Passo a passo simplificado + depoimento de iniciante.",
    evitar: "Falar de equipe, liderança ou plano de carreira longo — foco no primeiro resultado.",
  },
  vendedor_em_evolucao: {
    dor_principal: "Já vende algo, mas perde vendas por falta de organização e follow-up.",
    desejo_dominante: "Ter um sistema que sustente o crescimento que já começou.",
    medo_principal: "Continuar no improviso e ver a concorrência ultrapassar.",
    objecao_provavel: "Eu já faço isso sozinho(a), não sei se preciso de mais uma ferramenta.",
    prova_necessaria: "Comparativo antes/depois de quem estruturou o processo.",
    pitch_sugerido: "Você já sabe vender. Falta estrutura pra não perder o que já está gerando.",
    material_indicado: "Vídeo sobre organização/CRM + case de quem estruturou.",
    evitar: "Discurso de 'comece do zero'.",
  },
  construtor_equipe: {
    dor_principal: "Quer crescer além de vender sozinho(a), mas não sabe como estruturar uma equipe.",
    desejo_dominante: "Liderar pessoas e construir uma rede que gere renda além da venda direta.",
    medo_principal: "Montar equipe e não conseguir sustentar ou liderar direito.",
    objecao_provavel: "Eu não sei se sei liderar pessoas.",
    prova_necessaria: "Plano de carreira/crescimento com exemplos de quem já lidera equipe.",
    pitch_sugerido: "O ecossistema tem um caminho estruturado pra quem quer crescer liderando, não só vendendo — você não constrói isso sozinho(a), tem suporte.",
    material_indicado: "Convite pra apresentação de liderança/equipe.",
    evitar: "Tratar como se fosse só sobre vender mais um produto.",
  },
  empreendedor_servicos: {
    dor_principal: "Quer uma renda mais estável e recorrente, não só vendas pontuais de produto.",
    desejo_dominante: "Ter comissão recorrente vendendo serviços que o cliente continua usando.",
    medo_principal: "Investir em algo e a renda não ser realmente recorrente/duradoura.",
    objecao_provavel: "Isso de telefonia/energia/saúde realmente dá uma renda que continua?",
    prova_necessaria: "Explicação de como funciona a comissão recorrente (ATL NEX, ON MED, Energia).",
    pitch_sugerido: "Diferente da venda de produto, aqui você ganha enquanto o cliente continuar usando o serviço — é a parte do ecossistema focada em recorrência.",
    material_indicado: "Vídeo dos serviços (ATL NEX/ON MED/Energia/Apps) e como funciona a recorrência.",
    evitar: "Focar só em produto físico, ignorando o interesse principal desse perfil.",
  },
  perfil_premium: {
    dor_principal: "Tem capital e pressa, mas ainda não decidiu o caminho mais completo.",
    desejo_dominante: "Começar já com acesso completo, sem passar por etapas menores.",
    medo_principal: "Investir no completo e não ter suporte/atenção adequada.",
    objecao_provavel: "Vale a pena já entrar direto no completo?",
    prova_necessaria: "Comparativo de planos + atendimento prioritário.",
    pitch_sugerido: "Seu perfil já tem o que a maioria não tem: capital e decisão rápida. Faz sentido começar direto no acesso completo, com atendimento prioritário.",
    material_indicado: "Comparativo de planos + agendamento com especialista.",
    evitar: "Tratar como iniciante ou sugerir começar pequeno.",
  },
};

// ── Mapeamentos de label → valor ──────────────────────────────────────────────

const CAMINHO_MAP: Record<string, LeadCaminho> = {
  "Vender Produtos":                                        LeadCaminho.produto,
  "Vender Serviços":                                        LeadCaminho.servico,
  "Produtos e Serviços":                                    LeadCaminho.ambos,
  "Só quero consumir com desconto, não quero revender":     LeadCaminho.apenas_consumir,
  "Ainda não sei (me ajude a decidir)":                     LeadCaminho.indeciso,
};

const MODALIDADE_MAP: Record<string, LeadModalidade> = {
  "100% Digital":                 LeadModalidade.digital,
  "Presencial na minha região":   LeadModalidade.presencial,
  "Misto (digital + presencial)": LeadModalidade.misto,
};

const INTERESSE_MAP: Record<string, string> = {
  "Produtos físicos":             "produtos_fisicos",
  "Saúde/assistência":            "saude",
  "Telefonia":                    "telefonia",
  "Energia":                      "energia",
  "Aplicativos/serviços digitais":"apps",
  "Tudo junto":                   "tudo",
};

const TRAVA_MAP: Record<string, string> = {
  "Medo de não vender":        "medo_vender",
  "Falta de gente pra oferecer":"falta_pessoas",
  "Não sei divulgar":          "nao_sei_divulgar",
  "Falta de organização":      "falta_organizacao",
  "Medo de investir errado":   "medo_investir",
};

// ── Cascata de 6 perfis (ordem importa — primeira regra que bater, decide) ───

function calcularPerfil(a: {
  caminho?: string;
  motivacao_dominante?: string;
  capacidade_investimento?: string;
  renda_familiar?: string;
  experiencia_vendas?: string;
  interesse_principal?: string; // já mapeado via INTERESSE_MAP
}): LeadPerfil {
  // 1. Só quer consumir → consumidor_curioso
  if (CAMINHO_MAP[a.caminho ?? ""] === LeadCaminho.apenas_consumir)
    return LeadPerfil.consumidor_curioso;

  // 2. Quer liderar equipe → construtor_equipe
  if (a.motivacao_dominante === "Quero liderar uma equipe e construir uma rede")
    return LeadPerfil.construtor_equipe;

  // 3. Capital alto + renda alta → perfil_premium
  if (
    ["R$1.000 a R$3.000", "Acima de R$3.000"].includes(a.capacidade_investimento ?? "") &&
    ["R$5.000 a R$10.000", "Acima de R$10.000"].includes(a.renda_familiar ?? "")
  )
    return LeadPerfil.perfil_premium;

  // 4. Já vende → vendedor_em_evolucao
  if (a.experiencia_vendas === "Já vendo hoje, quero crescer")
    return LeadPerfil.vendedor_em_evolucao;

  // 5. Interesse em serviços recorrentes → empreendedor_servicos
  if (["saude", "telefonia", "energia", "apps"].includes(a.interesse_principal ?? ""))
    return LeadPerfil.empreendedor_servicos;

  // 6. Padrão → renda_extra_inicial
  return LeadPerfil.renda_extra_inicial;
}

// ── Gerador de código único ───────────────────────────────────────────────────

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

// ── Tipo de entrada ───────────────────────────────────────────────────────────

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
  interesse_principal?: string;
  maior_trava?: string;
  source?: string;
  user_agent?: string;
  page_url?: string;
};

// ── Server Action ─────────────────────────────────────────────────────────────

export async function criarLead(input: CreateLeadInput): Promise<{ codigo: string }> {
  const interesseMapeado = INTERESSE_MAP[input.interesse_principal ?? ""] ?? input.interesse_principal;
  const travaMapeada    = TRAVA_MAP[input.maior_trava ?? ""] ?? input.maior_trava;

  const perfil = calcularPerfil({
    caminho:                 input.caminho,
    motivacao_dominante:     input.motivacao_dominante,
    capacidade_investimento: input.capacidade_investimento,
    renda_familiar:          input.renda_familiar,
    experiencia_vendas:      input.experiencia_vendas,
    interesse_principal:     interesseMapeado,
  });

  const devolutiva = DEVOLUTIVA[perfil];
  const codigo = await gerarCodigo();

  await db.rendaInteligenteLeads.create({
    data: {
      company_id:              input.company_id,
      seller_id:               input.seller_id,
      codigo,
      nome:                    input.nome,
      whatsapp:                input.whatsapp,
      email:                   input.email || undefined,
      caminho:                 CAMINHO_MAP[input.caminho] ?? LeadCaminho.indeciso,
      modalidade:              MODALIDADE_MAP[input.modalidade] ?? LeadModalidade.misto,
      area_atual:              input.area_atual,
      gap_renda:               input.gap_renda,
      meta_mensal:             input.meta_mensal,
      horas_disponiveis:       input.horas_disponiveis,
      renda_familiar:          input.renda_familiar,
      capacidade_investimento: input.capacidade_investimento,
      experiencia_vendas:      input.experiencia_vendas,
      motivacao_dominante:     input.motivacao_dominante,
      canal_preferido:         input.canal_preferido,
      interesse_principal:     interesseMapeado,
      maior_trava:             travaMapeada,
      perfil_resultante:       perfil,
      ...devolutiva,
      kanban:   LeadKanban.novo_contato,
      respostas: {
        caminho:                 input.caminho,
        modalidade:              input.modalidade,
        area_atual:              input.area_atual,
        gap_renda:               input.gap_renda,
        meta_mensal:             input.meta_mensal,
        horas_disponiveis:       input.horas_disponiveis,
        renda_familiar:          input.renda_familiar,
        capacidade_investimento: input.capacidade_investimento,
        experiencia_vendas:      input.experiencia_vendas,
        motivacao_dominante:     input.motivacao_dominante,
        canal_preferido:         input.canal_preferido,
        interesse_principal:     input.interesse_principal,
        maior_trava:             input.maior_trava,
      },
      source:     input.source,
      user_agent: input.user_agent,
      page_url:   input.page_url,
    },
  });

  return { codigo };
}
