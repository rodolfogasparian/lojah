"use client";

import { useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  Package,
  Briefcase,
  Layers,
  HelpCircle,
  Smartphone,
  MapPin,
  Shuffle,
  Building2,
  UserX,
  Landmark,
  MoreHorizontal,
  CheckCircle2,
  Scale,
  TrendingDown,
  AlertTriangle,
  Wallet,
  Clock,
  Clock3,
  Clock9,
  ClockAlert,
  Sprout,
  Store,
  Rocket,
  Zap,
  DoorOpen,
  Building,
  FileText,
  Radio,
  MessageCircle,
  Users,
  Tag,
  Heart,
  Phone,
  Megaphone,
  Calendar,
} from "lucide-react";
import { criarLead } from "./actions";

// ── Tipos ─────────────────────────────────────────────────────────────────────

type QuizAnswers = {
  motivacao_dominante?: string;
  caminho?: string;
  interesse_principal?: string;
  modalidade?: string;
  area_atual?: string;
  gap_renda?: string;
  meta_mensal?: string;
  horas_disponiveis?: string;
  renda_familiar?: string;
  capacidade_investimento?: string;
  experiencia_vendas?: string;
  maior_trava?: string;
  canal_preferido?: string;
};

type QuestionOption = {
  label: string;
  icon: LucideIcon;
};

type Question = {
  id: keyof QuizAnswers;
  text: string;
  options: QuestionOption[];
  iconColor: string;
};

// ── 13 Perguntas (nova ordem) ─────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // P1 — motivação
  {
    id: "motivacao_dominante",
    text: "O que você mais busca hoje?",
    iconColor: "bg-rose-100 text-rose-700",
    options: [
      { label: "Preciso de dinheiro rápido",                     icon: Zap      },
      { label: "Quero sair do CLT",                              icon: DoorOpen },
      { label: "Quero renda extra sem largar o que faço",        icon: Layers   },
      { label: "Quero construir algo meu",                       icon: Building },
      { label: "Quero liderar uma equipe e construir uma rede",  icon: Users    },
    ],
  },
  // P2 — caminho
  {
    id: "caminho",
    text: "Qual caminho combina mais com você?",
    iconColor: "bg-emerald-100 text-emerald-700",
    options: [
      { label: "Vender Produtos",                                         icon: Package   },
      { label: "Vender Serviços",                                         icon: Briefcase },
      { label: "Produtos e Serviços",                                     icon: Layers    },
      { label: "Só quero consumir com desconto, não quero revender",      icon: Tag       },
      { label: "Ainda não sei (me ajude a decidir)",                      icon: HelpCircle},
    ],
  },
  // P3 — interesse principal (nova)
  {
    id: "interesse_principal",
    text: "O que mais chama sua atenção dentro desse ecossistema?",
    iconColor: "bg-violet-100 text-violet-700",
    options: [
      { label: "Produtos físicos",              icon: Package    },
      { label: "Saúde/assistência",             icon: Heart      },
      { label: "Telefonia",                     icon: Phone      },
      { label: "Energia",                       icon: Zap        },
      { label: "Aplicativos/serviços digitais", icon: Smartphone },
      { label: "Tudo junto",                    icon: Layers     },
    ],
  },
  // P4 — modalidade
  {
    id: "modalidade",
    text: "Como você imagina atuar?",
    iconColor: "bg-blue-100 text-blue-700",
    options: [
      { label: "100% Digital",                 icon: Smartphone },
      { label: "Presencial na minha região",   icon: MapPin     },
      { label: "Misto (digital + presencial)", icon: Shuffle    },
    ],
  },
  // P5 — área atual
  {
    id: "area_atual",
    text: "Qual sua área de trabalho atual?",
    iconColor: "bg-purple-100 text-purple-700",
    options: [
      { label: "CLT tempo integral", icon: Building2     },
      { label: "Autônomo(a)",        icon: Briefcase     },
      { label: "Desempregado(a)",    icon: UserX         },
      { label: "Aposentado(a)",      icon: Landmark      },
      { label: "Outros",             icon: MoreHorizontal},
    ],
  },
  // P6 — gap de renda
  {
    id: "gap_renda",
    text: "Hoje sua renda cobre o que você precisa?",
    iconColor: "bg-red-100 text-red-700",
    options: [
      { label: "Cobre bem",         icon: CheckCircle2  },
      { label: "Cobre só o básico", icon: Scale         },
      { label: "Não cobre",         icon: TrendingDown  },
      { label: "Estou no vermelho", icon: AlertTriangle },
    ],
  },
  // P7 — meta mensal
  {
    id: "meta_mensal",
    text: "Quanto pretende ganhar por mês com esse novo negócio?",
    iconColor: "bg-amber-100 text-amber-700",
    options: [
      { label: "Até R$1.000",        icon: Wallet },
      { label: "R$1.000 a R$3.000",  icon: Wallet },
      { label: "R$3.000 a R$5.000",  icon: Wallet },
      { label: "R$5.000 a R$10.000", icon: Wallet },
      { label: "Acima de R$10.000",  icon: Wallet },
    ],
  },
  // P8 — horas disponíveis
  {
    id: "horas_disponiveis",
    text: "Quantas horas por dia você tem disponíveis?",
    iconColor: "bg-sky-100 text-sky-700",
    options: [
      { label: "Até 1h",     icon: Clock      },
      { label: "1h a 3h",    icon: Clock3     },
      { label: "3h a 6h",    icon: Clock9     },
      { label: "Mais de 6h", icon: ClockAlert },
    ],
  },
  // P9 — renda familiar
  {
    id: "renda_familiar",
    text: "Qual a renda familiar atual?",
    iconColor: "bg-orange-100 text-orange-700",
    options: [
      { label: "Até R$2.000",        icon: Wallet },
      { label: "R$2.000 a R$5.000",  icon: Wallet },
      { label: "R$5.000 a R$10.000", icon: Wallet },
      { label: "Acima de R$10.000",  icon: Wallet },
    ],
  },
  // P10 — capacidade de investimento
  {
    id: "capacidade_investimento",
    text: "Quanto pretende investir por mês em aprendizado, ferramentas e divulgação?",
    iconColor: "bg-indigo-100 text-indigo-700",
    options: [
      { label: "Não posso investir agora", icon: TrendingDown },
      { label: "Até R$100",               icon: Wallet       },
      { label: "R$100 a R$300",           icon: Wallet       },
      { label: "R$300 a R$1.000",         icon: Wallet       },
      { label: "R$1.000 a R$3.000",       icon: Wallet       },
      { label: "Acima de R$3.000",        icon: Wallet       },
    ],
  },
  // P11 — experiência de vendas
  {
    id: "experiencia_vendas",
    text: "Você já vendeu algo pela internet ou porta a porta?",
    iconColor: "bg-green-100 text-green-700",
    options: [
      { label: "Nunca vendi",                  icon: Sprout },
      { label: "Já vendi um pouco",            icon: Store  },
      { label: "Já vendo hoje, quero crescer", icon: Rocket },
    ],
  },
  // P12 — maior trava (nova)
  {
    id: "maior_trava",
    text: "O que mais te trava hoje?",
    iconColor: "bg-yellow-100 text-yellow-700",
    options: [
      { label: "Medo de não vender",          icon: AlertTriangle },
      { label: "Falta de gente pra oferecer", icon: Users         },
      { label: "Não sei divulgar",            icon: Megaphone     },
      { label: "Falta de organização",        icon: Calendar      },
      { label: "Medo de investir errado",     icon: TrendingDown  },
    ],
  },
  // P13 — canal preferido
  {
    id: "canal_preferido",
    text: "Como prefere aprender e ser acompanhado?",
    iconColor: "bg-teal-100 text-teal-700",
    options: [
      { label: "Passo a passo por texto",      icon: FileText      },
      { label: "Vídeos curtos",                icon: Rocket        },
      { label: "Lives e treinamentos ao vivo", icon: Radio         },
      { label: "Conversa com uma pessoa",      icon: MessageCircle },
      { label: "Misto",                        icon: Shuffle       },
    ],
  },
];

// ── 5 Pausas de vídeo ─────────────────────────────────────────────────────────

const SUPABASE_VIDEOS = "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/videos-plano";

const VIDEOS: Record<
  1 | 2 | 3 | 4 | 5,
  { title: string; text: string; mp4Url?: string }
> = {
  1: {
    title: "Uma informação importante",
    mp4Url: `${SUPABASE_VIDEOS}/introducao-atlantica.mp4`,
    text: "A maioria das pessoas começa buscando uma renda extra. Mas o que muda o jogo é entender que você pode vender produtos que as pessoas já consomem e também serviços que geram recorrência. Ou seja: você não depende de uma única venda. Você pode começar simples, pelo WhatsApp, e crescer criando uma base de clientes.",
  },
  2: {
    title: "Sobre os Produtos",
    mp4Url: `${SUPABASE_VIDEOS}/introducao-produtos-imagens.mp4`,
    text: "No ecossistema de produtos, você pode trabalhar com itens de consumo recorrente: suplementação, vitaminas, perfumaria, linha capilar, cuidados diários e outros produtos que as pessoas compram mais de uma vez. Isso facilita a revenda, porque você não precisa convencer alguém sobre algo distante. Você apresenta soluções que entram na rotina.",
  },
  3: {
    title: "Sobre os Serviços",
    mp4Url: `${SUPABASE_VIDEOS}/servicos-atlantica.mp4`,
    text: "Além dos produtos, existe uma parte muito forte: os serviços recorrentes. Saúde acessível, telefonia, energia e soluções digitais. A diferença é simples: quando o cliente continua usando, você pode continuar recebendo. É aqui que muita gente começa a enxergar o negócio como renda recorrente, não só venda pontual.",
  },
  4: {
    title: "Histórias reais de transformação",
    // TODO: substituir por vídeo próprio de objeções quando gravado
    mp4Url: `${SUPABASE_VIDEOS}/depoimento-renata-atl.mp4`,
    text: "Antes de continuar, veja a história de alguém que já esteve exatamente onde você está agora — e decidiu dar o primeiro passo.",
  },
  5: {
    title: "Quase pronto…",
    mp4Url: `${SUPABASE_VIDEOS}/formulario-final-web.mp4`,
    text: "Com base nas suas respostas, o sistema vai indicar o melhor caminho para você começar. Pode ser como consumidor, consultor de produtos, vendedor de serviços ou com acesso completo ao ecossistema. A ideia é simples: não empurrar qualquer plano. É entender seu perfil e mostrar o próximo passo mais coerente.",
  },
};

// ── Fluxo de etapas ───────────────────────────────────────────────────────────

type StepDef =
  | { type: "hero" }
  | { type: "question"; questionIndex: number }
  | { type: "video"; videoId: 1 | 2 | 3 | 4 | 5 }
  | { type: "capture" };

const STEPS: StepDef[] = [
  { type: "hero" },                           // step 0  — abertura

  { type: "question", questionIndex: 0 },     // step 1  — motivacao_dominante
  { type: "question", questionIndex: 1 },     // step 2  — caminho
  { type: "question", questionIndex: 2 },     // step 3  — interesse_principal

  { type: "video", videoId: 1 },              // step 4  — vídeo 1 (Oportunidade)

  { type: "question", questionIndex: 3 },     // step 5  — modalidade

  { type: "video", videoId: 2 },              // step 6  — vídeo 2 (Produtos)
  { type: "video", videoId: 3 },              // step 7  — vídeo 3 (Serviços Recorrentes)

  { type: "question", questionIndex: 4 },     // step 8  — area_atual
  { type: "question", questionIndex: 5 },     // step 9  — gap_renda
  { type: "question", questionIndex: 6 },     // step 10 — meta_mensal
  { type: "question", questionIndex: 7 },     // step 11 — horas_disponiveis
  { type: "question", questionIndex: 8 },     // step 12 — renda_familiar
  { type: "question", questionIndex: 9 },     // step 13 — capacidade_investimento
  { type: "question", questionIndex: 10 },    // step 14 — experiencia_vendas
  { type: "question", questionIndex: 11 },    // step 15 — maior_trava

  { type: "video", videoId: 4 },              // step 16 — vídeo 4 (Medo e Objeções)

  { type: "question", questionIndex: 12 },    // step 17 — canal_preferido

  { type: "video", videoId: 5 },              // step 18 — vídeo 5 (Caminho Recomendado)

  { type: "capture" },                        // step 19 — formulário final
];

const TOTAL_QUESTIONS = 13;

// ── Barra de progresso (reutilizada em hero, perguntas e vídeos) ─────────────

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-1 bg-gray-200">
      <div
        className="h-1 bg-green-600 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  sellerId: string;
  companyId: string;
  sellerName: string;
  sellerWhatsapp: string;
  sellerSlug: string;
  companySlug: string;
};

// ── Componente ────────────────────────────────────────────────────────────────

export function PlanoQuiz({
  sellerId,
  companyId,
  sellerName,
  sellerWhatsapp,
  sellerSlug,
  companySlug,
}: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [capture, setCapture] = useState({ nome: "", email: "", whatsapp: "" });
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<{ codigo: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const answeredCount = STEPS.filter(
    (s) => s.type === "question" && answers[QUESTIONS[s.questionIndex].id] !== undefined,
  ).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  function handleAnswer(id: keyof QuizAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setStep((prev) => prev + 1);
  }

  function handleBack() {
    if (step > 0) setStep((prev) => prev - 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!capture.nome.trim() || !capture.whatsapp.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        const result = await criarLead({
          company_id: companyId,
          seller_id: sellerId,
          nome: capture.nome.trim(),
          email: capture.email.trim(),
          whatsapp: capture.whatsapp.replace(/\D/g, ""),
          caminho: answers.caminho ?? "",
          modalidade: answers.modalidade ?? "",
          area_atual: answers.area_atual,
          gap_renda: answers.gap_renda,
          meta_mensal: answers.meta_mensal,
          horas_disponiveis: answers.horas_disponiveis,
          renda_familiar: answers.renda_familiar,
          capacidade_investimento: answers.capacidade_investimento,
          experiencia_vendas: answers.experiencia_vendas,
          motivacao_dominante: answers.motivacao_dominante,
          canal_preferido: answers.canal_preferido,
          interesse_principal: answers.interesse_principal,
          maior_trava: answers.maior_trava,
          source: "quiz",
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          page_url: typeof window !== "undefined" ? window.location.href : undefined,
        });

        setSuccess(result);

        if (sellerWhatsapp) {
          const resultUrl = `https://${companySlug}.lojah.app/${sellerSlug}/plano/resultado/${result.codigo}`;
          const msg =
            `Olá, sou ${capture.nome.trim()} e acabei de solicitar meu Plano Renda Inteligente ${result.codigo}. ` +
            `Vou acessar o link abaixo agora com minha recomendação personalizada: ${resultUrl}`;
          window.open(`https://wa.me/${sellerWhatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
        }
      } catch {
        setError("Erro ao enviar. Tente novamente.");
      }
    });
  }

  // ── Tela de sucesso ───────────────────────────────────────────────────────

  if (success) {
    const resultUrl = `https://${companySlug}.lojah.app/${sellerSlug}/plano/resultado/${success.codigo}`;
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-sm w-full">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Plano enviado!</h1>
          <p className="text-gray-600 mb-1">
            Seu código é{" "}
            <strong className="text-green-700 font-mono">{success.codigo}</strong>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            O WhatsApp foi aberto com sua mensagem. Envie agora para tirar suas dúvidas.
          </p>
          <a
            href={resultUrl}
            className="block w-full py-3.5 rounded-xl bg-green-700 text-white font-semibold text-center hover:bg-green-800 transition-colors"
          >
            Ver meu diagnóstico
          </a>
        </div>
      </div>
    );
  }

  const currentStep = STEPS[step];

  // ── Hero ──────────────────────────────────────────────────────────────────

  if (currentStep.type === "hero") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f3d1f] to-green-900 flex flex-col">
        <ProgressBar pct={5} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className="max-w-sm w-full text-center">
            <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] rounded-full px-3 py-1 mb-6">
              PLANO RENDA INTELIGENTE
            </span>
            <h1 className="text-[1.65rem] font-extrabold text-white leading-tight mb-4">
              Produtos ou Serviços? Descubra qual caminho te dá mais resultado
            </h1>
            <p className="text-sm text-green-200/90 mb-8 leading-relaxed">
              Responda algumas perguntas e receba, na hora, o perfil e a recomendação certa pra você — leva menos de 3 minutos.
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-4 rounded-xl bg-[#00ff88] text-[#0f3d1f] font-bold text-base hover:brightness-90 transition-all active:scale-[0.98] shadow-lg"
            >
              Receber meu Diagnóstico
            </button>
            <p className="mt-6 text-xs text-green-300/70">
              Essa é uma recomendação de: <span className="font-semibold text-green-200">{sellerName}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Pergunta ──────────────────────────────────────────────────────────────

  if (currentStep.type === "question") {
    const question = QUESTIONS[currentStep.questionIndex];
    const questionNumber = currentStep.questionIndex + 1;

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
        <ProgressBar pct={progress} />

        <div className="flex items-center px-4 py-3">
          <button
            type="button"
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 -ml-1 p-1"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-xs text-gray-400 ml-auto">
            {questionNumber} de {TOTAL_QUESTIONS}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10 max-w-lg mx-auto w-full">
          <p className="text-[11px] font-bold text-green-700 uppercase tracking-wider mb-3">
            Plano Renda Inteligente
          </p>
          <h2 className="text-[1.2rem] font-bold text-gray-800 mb-6 leading-snug">
            {question.text}
          </h2>
          <div className="flex flex-col gap-3">
            {question.options.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleAnswer(question.id, option.label)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 bg-white hover:border-green-500 hover:bg-green-50 text-left transition-all active:scale-[0.98] shadow-sm"
                >
                  <span className={`size-9 rounded-full flex items-center justify-center shrink-0 ${question.iconColor}`}>
                    <Icon className="size-4" />
                  </span>
                  <span className="font-semibold text-sm text-gray-800 leading-snug">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Pausa de vídeo ────────────────────────────────────────────────────────

  if (currentStep.type === "video") {
    const vid = VIDEOS[currentStep.videoId];
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
        <ProgressBar pct={progress} />

        <div className="flex items-center px-4 py-3">
          <button
            type="button"
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 -ml-1 p-1"
          >
            <ChevronLeft className="size-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-10 max-w-lg mx-auto w-full">
          <p className="text-[11px] font-bold text-green-700 uppercase tracking-wider mb-3">
            Plano Renda Inteligente
          </p>
          <h2 className="text-xl font-bold text-gray-800 mb-5">{vid.title}</h2>

          {vid.mp4Url ? (
            <video
              src={vid.mp4Url}
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-2xl mb-5 bg-black"
              style={{ maxHeight: "56vw" }}
            />
          ) : (
            <div className="w-full aspect-video rounded-2xl bg-[#0f3d1f]/10 border-2 border-dashed border-green-300 flex items-center justify-center mb-5">
              <span className="text-green-700 text-sm font-medium">Vídeo em breve</span>
            </div>
          )}

          <blockquote className="bg-green-50 border-l-4 border-green-500 px-4 py-4 rounded-r-xl mb-6">
            <p className="text-sm text-gray-700 leading-relaxed italic">{vid.text}</p>
          </blockquote>

          <button
            type="button"
            onClick={() => setStep((prev) => prev + 1)}
            className="w-full py-3.5 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // ── Captura ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <div className="w-full h-1 bg-green-600" />

      <div className="flex items-center px-4 py-3">
        <button
          type="button"
          onClick={handleBack}
          className="text-gray-400 hover:text-gray-600 -ml-1 p-1"
        >
          <ChevronLeft className="size-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 pb-10 max-w-lg mx-auto w-full">
        <p className="text-[11px] font-bold text-green-700 uppercase tracking-wider mb-3">
          Plano Renda Inteligente
        </p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Última etapa antes de receber seu Plano Renda Inteligente
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Preencha os dados abaixo. Seu diagnóstico personalizado será enviado pelo WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              Nome completo *
            </label>
            <input
              type="text"
              required
              value={capture.nome}
              onChange={(e) => setCapture((p) => ({ ...p, nome: e.target.value }))}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={capture.whatsapp}
              onChange={(e) => setCapture((p) => ({ ...p, whatsapp: e.target.value }))}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              E-mail{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="email"
              value={capture.email}
              onChange={(e) => setCapture((p) => ({ ...p, email: e.target.value }))}
              placeholder="seu@email.com"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-xl bg-green-700 text-white font-bold text-base hover:bg-green-800 transition-colors disabled:opacity-60 mt-1"
          >
            {isPending ? "Enviando…" : "Receber meu plano no WhatsApp"}
          </button>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            Ao continuar, você concorda com a{" "}
            <a href="/privacidade" className="underline">
              Política de Privacidade
            </a>{" "}
            e os{" "}
            <a href="/termos" className="underline">
              Termos de Uso
            </a>
            . Seus dados são usados apenas para envio do plano e acompanhamento pelo consultor indicado.
          </p>
        </form>
      </div>
    </div>
  );
}
