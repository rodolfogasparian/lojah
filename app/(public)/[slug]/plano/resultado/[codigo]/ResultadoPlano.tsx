"use client";

import { useState } from "react";

const LOGO_URL =
  "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/logo-atl-neon.png";

const KITS = [
  {
    name: "Consultor(a) de Produtos",
    price: "R$ 79,90",
    description: "Comece revendendo mais de 300 produtos com até 100% de lucro",
    image: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/10-banner-kit-livre.png",
    highlights: ["Acesso ao catálogo completo", "Loja online personalizada", "Suporte do consultor(a)", "Sem mensalidade"],
    isCatalog: false,
  },
  {
    name: "Licença ATL Services",
    price: "R$ 999,99",
    description: "Acesso completo ao ecossistema de produtos E serviços digitais",
    image: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/banner-licenca-neon.png",
    highlights: ["Inclui licença de produtos", "ATL ON MED + ATL NEX + Energia", "ATL APPs", "Comissões recorrentes mensais"],
    isCatalog: false,
  },
  {
    name: "Apenas consumir produtos",
    price: "Consulte valores",
    description: "Compre produtos de alta qualidade com desconto para uso pessoal",
    image: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/catalogo-3.png",
    highlights: ["Mais de 300 produtos", "Preço de consultor(a)", "Sem compromisso de revenda"],
    isCatalog: true,
  },
];

const BENEFITS = [
  { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/3-banner-300-produtos.png", title: "Ecossistema de Produtos", description: "Mais de 300 produtos: Suplementação, Vitaminas, Perfumaria Fina, Óleos Ozonizados, Linha Capilar e Cuidados Diários. Lucro de até 100% na revenda.", type: "produto" },
  { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/20-banner-atl-onmed.png", title: "ATL ON MED", description: "Assistência médica acessível para toda a família. Comissões recorrentes por cada novo cliente.", type: "servico" },
  { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/11-banner-chip.png", title: "ATL NEX — Telefonia", description: "Planos de telefonia digital. Ganhe comissão recorrente enquanto seu cliente usar o plano.", type: "servico" },
  { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/20-energia-assinatura.png", title: "Energia por Assinatura", description: "Até 55% de comissão por cada novo cliente de energia. Renda passiva todo mês.", type: "servico" },
  { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/17-banner-apps.png", title: "ATL APPs", description: "Aplicativos e soluções digitais. Tecnologia que conecta, soluções que transformam.", type: "servico" },
  { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/18-banner-renda-recorrente.png", title: "Renda Recorrente", description: "Receba renda recorrente de todo o sistema de produtos e serviços.", type: "servico" },
];

const EARNINGS = [
  { icon: "🌱", title: "Iniciante", description: "Vendendo nas horas livres, no WhatsApp e redes sociais.", value: "R$ 1.500/mês" },
  { icon: "🚀", title: "Dedicado", description: "Algumas horas por dia, com catálogo e divulgação ativa.", value: "R$ 4.000/mês" },
  { icon: "👑", title: "Profissional", description: "Full-time, com equipe e estratégia de tráfego.", value: "R$ 10.000+/mês" },
];

const CAREER = [
  { label: "Bronze", stars: 1, desc: "Primeiros cadastros e primeiras vendas" },
  { label: "Prata", stars: 2, desc: "Equipe crescendo, renda recorrente" },
  { label: "Ouro", stars: 3, desc: "Liderança ativa, bônus maiores" },
  { label: "Diamante", stars: 4, desc: "Gestão de múltiplas equipes" },
  { label: "Royal", stars: 5, desc: "Ecossistema completo, máxima comissão" },
];

const FAQ = [
  { q: "Quanto tempo leva para começar a vender?", a: "Você já pode começar a vender a partir do momento do cadastro." },
  { q: "Existe mensalidade ou taxa?", a: "Para fazer suas vendas não existe mínimo de meta. Para ganhar bônus de formação de equipe é necessário estar ativo no mês com um pedido de pelo menos 50 pontos (equivalente a R$ 150 reais)." },
  { q: "Preciso comprar estoque?", a: "Não! Você faz o pedido após a venda. Sem risco de encalhe e sem precisar investir em estoque antecipado." },
  { q: "Preciso ter CNPJ?", a: "Não. Você pode começar como pessoa física. O cadastro é simples e rápido, feito 100% online." },
  { q: "Como e quando recebo minhas comissões?", a: "Suas comissões você recebe ao entregar o produto ao cliente, pois você compra com preço diferenciado. A diferença do valor de venda com o valor de compra é o seu lucro." },
  { q: "Posso indicar outras pessoas e ganhar por isso?", a: "Sim! Ao formar sua equipe você passa a receber bônus sobre as vendas das pessoas que você indicou, gerando renda recorrente." },
  { q: "O que está incluído na Licença ATL Services?", a: "A licença inclui acesso ao ecossistema completo: produtos Atlântica Natural + ATL ON MED (assistência médica) + ATL NEX (telefonia) + Energia por Assinatura + ATL APPs. Tudo em um único cadastro." },
  { q: "Os produtos têm registro na Anvisa?", a: "Sim. Todos os produtos Atlântica Natural seguem as normas regulatórias brasileiras e possuem os registros necessários." },
];

const PERFIL_LABELS: Record<string, string> = {
  iniciante_urgente: "Iniciante com Urgência",
  sonhador_cauteloso: "Sonhador(a) Cauteloso(a)",
  investidor_pronto: "Investidor(a) Pronto(a)",
  vendedor_em_evolucao: "Vendedor(a) em Evolução",
  tempo_limitado: "Tempo Limitado",
};

const PERFIL_ICONS: Record<string, string> = {
  iniciante_urgente: "⚡",
  sonhador_cauteloso: "🌱",
  investidor_pronto: "💼",
  vendedor_em_evolucao: "📈",
  tempo_limitado: "⏱️",
};

const PERFIL_ARGS: Record<string, string> = {
  iniciante_urgente: "Caminho mais rápido e barato até o primeiro dinheiro entrando.",
  sonhador_cauteloso: "Comece pequeno e sem risco — dá pra migrar para a Licença depois quando sentir segurança.",
  investidor_pronto: "Ecossistema completo (produtos + serviços), comissão recorrente e plano de carreira estruturado.",
  vendedor_em_evolucao: "Estrutura para escalar o que já vende, construir equipe e profissionalizar o processo.",
  tempo_limitado: "Baixo tempo de dedicação, sem compromisso de meta. Começa no seu próprio ritmo.",
};

function getKitIndex(perfil: string): number {
  return perfil === "investidor_pronto" || perfil === "vendedor_em_evolucao" ? 1 : 0;
}

function getEarningsHighlight(horas: string | null): number {
  if (!horas || horas === "Até 1h" || horas === "1h a 3h") return 0;
  if (horas === "3h a 6h") return 1;
  return 2;
}

type LeadData = {
  nome: string;
  codigo: string;
  perfil_resultante: string;
  dor_principal: string | null;
  desejo_dominante: string | null;
  medo_principal: string | null;
  pitch_sugerido: string | null;
  caminho: string;
  horas_disponiveis: string | null;
};

type SellerData = {
  name: string;
  whatsapp: string;
};

const neonGreen = { textShadow: "0 0 20px #00ff88, 0 0 40px #00ff88" };
const neonBox = { boxShadow: "0 0 20px rgba(0,255,136,0.6)" };

export default function ResultadoPlano({ lead, seller }: { lead: LeadData; seller: SellerData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const perfilLabel = PERFIL_LABELS[lead.perfil_resultante] ?? lead.perfil_resultante;
  const perfilIcon = PERFIL_ICONS[lead.perfil_resultante] ?? "🎯";
  const perfilArg = PERFIL_ARGS[lead.perfil_resultante] ?? "";
  const kitIndex = getKitIndex(lead.perfil_resultante);
  const earningsHighlight = getEarningsHighlight(lead.horas_disponiveis);
  const showCareer = lead.perfil_resultante === "investidor_pronto" || lead.perfil_resultante === "vendedor_em_evolucao";
  const waPhone = seller.whatsapp.replace(/\D/g, "");
  const recommendedKit = KITS[kitIndex];
  const firstName = lead.nome.split(" ")[0];

  function wa(msg: string) {
    return `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
  }

  const mainMsg = `Olá! Sou ${lead.nome}, acabei de fazer o Plano Renda Inteligente (${lead.codigo}) e meu perfil foi ${perfilLabel}. Quero saber mais sobre ${recommendedKit.name}.`;
  const kitMsg = (kitName: string) =>
    `Olá! Sou ${lead.nome}, acabei de fazer o Plano Renda Inteligente (${lead.codigo}) e meu perfil foi ${perfilLabel}. Quero saber mais sobre ${kitName}.`;

  const visibleBenefits =
    lead.caminho === "produto"
      ? [BENEFITS[0], BENEFITS[1], BENEFITS[5]]
      : lead.caminho === "servico"
      ? [BENEFITS[1], BENEFITS[2], BENEFITS[3], BENEFITS[4], BENEFITS[5], BENEFITS[0]]
      : BENEFITS;

  const caminhoTitle =
    lead.caminho === "produto"
      ? "Seu caminho: Ecossistema de Produtos"
      : lead.caminho === "servico"
      ? "Seu caminho: Ecossistema de Serviços"
      : "Você escolhe onde lucrar!";

  const caminhoSub =
    lead.caminho === "produto"
      ? "Revenda mais de 300 produtos com até 100% de lucro."
      : lead.caminho === "servico"
      ? "Comissão recorrente em serviços digitais que renovam todo mês."
      : "Dois ecossistemas completos. Você decide por qual começar.";

  return (
    <div className="min-h-screen w-full bg-[#fafaf7] text-[#1a1f1a] antialiased" style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <style>{`
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(0,255,136,0.5); }
          50% { box-shadow: 0 0 35px rgba(0,255,136,0.9), 0 0 70px rgba(0,255,136,0.3); }
        }
        .neon-pulse { animation: neonPulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* Barra topo */}
      <div className="w-full bg-[#0f3d1f] text-white text-[13px]">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center">
          <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#cfee9a]" />
          <span>Resultado do Plano Renda Inteligente — <span className="font-mono font-bold">{lead.codigo}</span></span>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-col items-start gap-0.5">
            <img src={LOGO_URL} alt="Atlântica Natural" className="h-12 object-contain" loading="lazy" decoding="async" />
            <span className="text-xs text-neutral-500">Com {seller.name}</span>
          </div>
          <a href={wa(mainMsg)} target="_blank" rel="noreferrer"
            className="neon-pulse shrink-0 rounded-full bg-[#00ff88] px-4 py-2 text-xs font-bold text-[#0a1a0a] transition hover:scale-105 sm:text-sm">
            💬 Falar com {seller.name}
          </a>
        </div>
      </header>

      {/* 1. Hero personalizado */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(900px 400px at 80% -10%, #cfee9a 0%, transparent 60%), radial-gradient(700px 350px at -10% 90%, #e6f7c7 0%, transparent 55%)" }} />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0f3d1f]/15 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0f3d1f] shadow-sm mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0f3d1f]" />
            Diagnóstico personalizado
          </span>
          <h1 className="text-3xl font-black leading-tight text-[#0f1f12] sm:text-4xl lg:text-5xl mb-3">
            Olá, {firstName}!<br />
            <span className="relative inline-block mt-1">
              <span className="relative z-10">Plano Renda Inteligente</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-full bg-[#cfee9a]" />
            </span>
          </h1>
          <p className="text-neutral-500 text-sm mb-6">Código: <span className="font-mono font-bold text-[#0f3d1f]">{lead.codigo}</span></p>
          <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-[#0f3d1f]/20 bg-white px-5 py-3 shadow-md">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#cfee9a] text-lg">{perfilIcon}</div>
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Seu perfil</p>
              <p className="text-base font-extrabold text-[#0f1f12]">{perfilLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Leitura do perfil */}
      <section className="bg-[#0a1a0a] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-black text-white text-center mb-2">O que seu diagnóstico revelou</h2>
          <p className="text-neutral-400 text-sm text-center mb-8">Com base nas suas respostas, identificamos o seguinte sobre você:</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {lead.dor_principal && (
              <div className="rounded-2xl border border-red-900/40 bg-[#1a0a0a] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Sua dor principal</p>
                <p className="text-sm text-neutral-200 leading-relaxed">{lead.dor_principal}</p>
              </div>
            )}
            {lead.desejo_dominante && (
              <div className="rounded-2xl border border-[#00ff88]/20 bg-[#0d1f0d] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#00ff88] mb-2">Seu desejo</p>
                <p className="text-sm text-neutral-200 leading-relaxed">{lead.desejo_dominante}</p>
              </div>
            )}
            {lead.medo_principal && (
              <div className="rounded-2xl border border-yellow-900/40 bg-[#1a1500] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">Seu maior medo</p>
                <p className="text-sm text-neutral-200 leading-relaxed">{lead.medo_principal}</p>
              </div>
            )}
          </div>
          {lead.pitch_sugerido && (
            <div className="mt-5 rounded-2xl border border-[#00ff88]/30 bg-[#0d2b0d] p-5 text-center">
              <p className="text-[#00ff88] font-bold text-base sm:text-lg leading-relaxed" style={neonGreen}>
                "{lead.pitch_sugerido}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Onde você está hoje — Quadrante E/A/D/I */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-black text-[#0f1f12] text-center sm:text-3xl mb-2">Onde você está hoje?</h2>
        <p className="text-sm text-neutral-600 text-center mb-8">A maioria das pessoas começa no lado esquerdo. A Atlântica Natural é o caminho para o lado direito.</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { letter: "E", label: "Empregado", desc: "Troca tempo por dinheiro. A segurança depende do empregador.", color: "red", highlight: false },
            { letter: "A", label: "Autônomo", desc: "Tem liberdade, mas para de ganhar quando para de trabalhar.", color: "orange", highlight: false },
            { letter: "D", label: "Dono de Negócio", desc: "O sistema trabalha por você. Você lidera pessoas e processos.", color: "green", highlight: true },
            { letter: "I", label: "Investidor", desc: "O dinheiro trabalha por você. Renda passiva e recorrente.", color: "green", highlight: false },
          ].map((q) => (
            <div key={q.letter} className={`rounded-2xl border-2 p-5 ${
              q.highlight
                ? "border-[#0f3d1f] bg-[#e8f5e9]"
                : q.color === "red"
                ? "border-red-200 bg-red-50"
                : q.color === "orange"
                ? "border-orange-200 bg-orange-50"
                : "border-[#0f3d1f]/30 bg-[#f4f8ec]"
            }`}>
              <p className={`text-2xl font-black mb-1 ${q.color === "red" ? "text-red-600" : q.color === "orange" ? "text-orange-600" : "text-[#0f3d1f]"}`}>{q.letter}</p>
              <p className={`text-sm font-extrabold ${q.color === "red" ? "text-red-800" : q.color === "orange" ? "text-orange-800" : "text-[#0f3d1f]"}`}>{q.label}</p>
              <p className={`text-xs mt-1 ${q.color === "red" ? "text-red-600" : q.color === "orange" ? "text-orange-600" : "text-[#1b5e20]"}`}>{q.desc}</p>
              {q.highlight && <span className="mt-2 inline-block text-[10px] font-bold bg-[#cfee9a] text-[#0f3d1f] px-2 py-0.5 rounded-full">SEU DESTINO ✓</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-neutral-400">Baseado no framework de Robert Kiyosaki (Pai Rico, Pai Pobre)</p>
      </section>

      {/* 4. Caminho recomendado */}
      <section className="bg-[#0d1f0d]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-black text-[#00ff88] text-center sm:text-3xl mb-2" style={neonGreen}>{caminhoTitle}</h2>
          <p className="text-sm text-neutral-400 text-center mb-8">{caminhoSub}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBenefits.map((b) => (
              <div key={b.title} className="overflow-hidden rounded-2xl border border-[#00ff88]/30 bg-[#0d1f0d] transition hover:-translate-y-1 hover:border-[#00ff88]">
                <img src={b.imageUrl} alt={b.title} className="w-full object-contain max-h-44" loading="lazy" decoding="async" />
                <div className="p-5">
                  <h3 className="text-base font-extrabold text-[#00ff88]" style={{ textShadow: "0 0 10px #00ff88" }}>{b.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Quanto você pode ganhar */}
      <section className="bg-[#0a1a0a] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black text-[#00ff88] text-center sm:text-3xl mb-2" style={neonGreen}>Quanto você pode ganhar</h2>
          <p className="text-sm text-neutral-400 text-center mb-8">
            {earningsHighlight === 0 && "Com seu tempo disponível, o nível Iniciante é o mais realista para começar."}
            {earningsHighlight === 1 && "Com seu tempo disponível, o nível Dedicado é onde você pode chegar."}
            {earningsHighlight === 2 && "Com sua disponibilidade, o nível Profissional é totalmente alcançável."}
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {EARNINGS.map((v, i) => (
              <div key={v.title} className={`rounded-3xl border p-6 transition hover:-translate-y-1 ${i === earningsHighlight ? "border-2 border-[#00ff88] bg-[#0d2b0d]" : "border-[#00ff88]/20 bg-[#0d1f0d]"}`}
                style={i === earningsHighlight ? { boxShadow: "0 0 30px rgba(0,255,136,0.5)" } : undefined}>
                {i === earningsHighlight && <span className="mb-2 inline-block text-[10px] font-bold bg-[#00ff88] text-[#0a1a0a] px-2 py-0.5 rounded-full">SEU POTENCIAL</span>}
                <div className="text-2xl mb-1">{v.icon}</div>
                <h3 className="text-lg font-extrabold text-white">{v.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{v.description}</p>
                <p className="mt-4 text-2xl font-black text-[#00ff88] sm:text-3xl" style={neonGreen}>{v.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-neutral-500">*Valores ilustrativos baseados na média dos consultores(as) ativos.</p>
        </div>
      </section>

      {/* 6. Kit recomendado */}
      <section className="bg-[#0d1f0d]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-black text-white text-center sm:text-3xl mb-2">Escolha como começar</h2>
          <p className="text-sm text-neutral-400 text-center mb-1">
            Para o perfil <strong className="text-[#00ff88]">{perfilLabel}</strong>, recomendamos:
          </p>
          <p className="text-xs text-neutral-500 text-center mb-8">{perfilArg}</p>

          {/* Kit em destaque */}
          <div className="mb-8 overflow-hidden rounded-3xl border-2 border-[#00ff88] bg-[#0a1a0a] sm:flex" style={{ boxShadow: "0 0 30px rgba(0,255,136,0.4)" }}>
            {recommendedKit.image && (
              <div className="sm:w-64 shrink-0 bg-[#0d1f0d]">
                <img src={recommendedKit.image} alt={recommendedKit.name} className="w-full h-full object-contain max-h-56 sm:max-h-none" loading="lazy" decoding="async" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <span className="w-fit mb-3 text-[11px] font-bold bg-[#00ff88] text-[#0a1a0a] px-2 py-0.5 rounded-full">RECOMENDADO PARA VOCÊ</span>
              <h3 className="text-2xl font-extrabold text-white">{recommendedKit.name}</h3>
              {recommendedKit.description && <p className="mt-1 text-sm text-neutral-300">{recommendedKit.description}</p>}
              <p className="mt-3 text-4xl font-black text-[#00ff88]" style={neonGreen}>{recommendedKit.price}</p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-neutral-200">
                {recommendedKit.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-[#00ff88]/40 bg-[#00ff88]/15 text-[10px] text-[#00ff88]">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <a href={wa(kitMsg(recommendedKit.name))} target="_blank" rel="noreferrer"
                className="neon-pulse mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#00ff88] px-6 py-3.5 text-sm font-bold text-[#0a1a0a] transition hover:scale-105">
                💬 Quero esse kit
              </a>
            </div>
          </div>

          {/* Outros kits */}
          <p className="text-center text-xs text-neutral-500 mb-4">Outras opções disponíveis:</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {KITS.filter((_, i) => i !== kitIndex).map((kit) => (
              <div key={kit.name} className="overflow-hidden rounded-2xl border border-[#00ff88]/20 bg-[#0a1a0a] flex flex-col">
                {kit.image && <img src={kit.image} alt={kit.name} className="w-full object-contain max-h-36" loading="lazy" decoding="async" />}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-extrabold text-white">{kit.name}</h3>
                  {kit.description && <p className="mt-1 text-xs text-neutral-400">{kit.description}</p>}
                  <p className="mt-2 text-xl font-black text-[#00ff88]">{kit.price}</p>
                  <a href={kit.isCatalog ? "#" : wa(kitMsg(kit.name))} target="_blank" rel="noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#00ff88]/40 px-4 py-2.5 text-xs font-bold text-[#00ff88] transition hover:bg-[#00ff88]/10">
                    💬 Saber mais
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Prova social */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-black text-[#0f1f12] text-center sm:text-3xl mb-2">Histórias reais de quem já começou</h2>
        <p className="text-sm text-neutral-600 text-center mb-8">Veja o que nossos consultores(as) estão conquistando.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          {["https://player.vimeo.com/video/687733508", "https://player.vimeo.com/video/687733046"].map((url, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-[#00ff88]/30 bg-[#0d1f0d]">
              <iframe src={url} title={`Depoimento ${i + 1}`} width="100%" height="250" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen />
            </div>
          ))}
        </div>
      </section>

      {/* 8. Plano de carreira — só para investidor_pronto e vendedor_em_evolucao */}
      {showCareer && (
        <section className="bg-[#0a1a0a] px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-black text-[#00ff88] text-center sm:text-3xl mb-2" style={neonGreen}>Seu plano de carreira</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">Na Atlântica Natural, você cresce conforme sua equipe e resultados crescem.</p>
            <div className="relative pl-10">
              <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#00ff88] to-[#00ff88]/10" />
              <div className="flex flex-col gap-4">
                {CAREER.map((level, i) => (
                  <div key={level.label} className="relative">
                    <div className="absolute -left-6 top-3 grid h-5 w-5 place-items-center rounded-full border-2 bg-[#0a1a0a] text-[10px] font-black"
                      style={{ borderColor: i === 0 ? "#00ff88" : "rgba(0,255,136,0.25)", color: i === 0 ? "#00ff88" : "rgba(0,255,136,0.4)" }}>
                      {i + 1}
                    </div>
                    <div className={`rounded-xl border p-4 ${i === 0 ? "border-[#00ff88] bg-[#0d2b0d]" : "border-[#00ff88]/15 bg-[#0d1f0d]"}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-white">{level.label}</span>
                        <span className="text-[#00ff88] text-xs">{"★".repeat(level.stars)}</span>
                        {i === 0 && <span className="text-[10px] font-bold bg-[#00ff88] text-[#0a1a0a] px-1.5 py-0.5 rounded-full">INÍCIO</span>}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{level.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-neutral-500">Detalhes completos sobre bônus e comissões por nível serão compartilhados pelo seu consultor(a).</p>
          </div>
        </section>
      )}

      {/* 9. FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-black text-[#0f1f12] text-center sm:text-3xl mb-2">Perguntas frequentes</h2>
        <p className="text-sm text-neutral-600 text-center mb-8">Tudo que você precisa saber antes de começar.</p>
        <div className="flex flex-col gap-3">
          {FAQ.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                <button type="button" onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                  <span className="text-sm font-extrabold text-[#0f1f12] sm:text-base">{f.q}</span>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#cfee9a] text-[#0f3d1f] transition ${open ? "rotate-45" : ""}`}>+</span>
                </button>
                {open && <div className="border-t border-black/5 px-5 py-4 text-sm text-neutral-600">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. CTA final */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-[#0f3d1f] p-8 text-center text-white shadow-xl sm:p-12">
          <h2 className="text-2xl font-black sm:text-3xl">
            Pronto para começar,{" "}
            <span className="text-[#00ff88]" style={neonGreen}>{firstName}?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
            Fale com {seller.name} agora pelo WhatsApp. Seu código{" "}
            <span className="font-mono font-bold text-[#cfee9a]">{lead.codigo}</span> já identifica seu diagnóstico — ela(e) já sabe o que você precisa.
          </p>
          <a href={wa(mainMsg)} target="_blank" rel="noreferrer"
            className="neon-pulse mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00ff88] px-6 py-4 text-base font-bold text-[#0a1a0a] transition hover:scale-105">
            💬 Falar com {seller.name} no WhatsApp
          </a>
          <p className="mt-3 text-xs text-white/50">
            Kit recomendado: {recommendedKit.name} — {recommendedKit.price}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-[#050f05]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={LOGO_URL} alt="Atlântica Natural" className="h-10 object-contain" loading="lazy" decoding="async" />
          <p className="text-xs text-neutral-500">© 2026 Atlântica Natural. Todos os direitos reservados.</p>
        </div>
        <div className="h-20 sm:hidden" />
      </footer>

      {/* Mobile fixed bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 p-3 backdrop-blur sm:hidden">
        <a href={wa(mainMsg)} target="_blank" rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00ff88] px-5 py-3 text-sm font-bold text-[#0a1a0a] shadow-lg" style={neonBox}>
          💬 Falar com {seller.name}
        </a>
      </div>

      {/* WhatsApp flutuante desktop */}
      <a href={wa(mainMsg)} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp"
        className="hidden sm:flex fixed bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full transition hover:scale-110"
        style={{ backgroundColor: "#25D366", boxShadow: "0 0 20px rgba(37,211,102,0.6)" }}>
        <svg viewBox="0 0 32 32" fill="white" className="h-7 w-7">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.663 4.614 1.813 6.52L4 29l7.695-1.787A11.94 11.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22a9.94 9.94 0 01-5.07-1.387l-.364-.213-4.566 1.06 1.09-4.455-.236-.373A9.956 9.956 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.406-7.463c-.297-.148-1.757-.868-2.03-.968-.272-.099-.47-.148-.668.148-.198.296-.766.968-.938 1.166-.173.198-.347.222-.643.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.457.13-.605.134-.133.297-.347.446-.52.148-.174.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.148-.668-1.613-.916-2.208-.24-.579-.486-.5-.668-.51l-.57-.01c-.198 0-.52.074-.792.371-.272.296-1.04 1.017-1.04 2.48 0 1.463 1.065 2.876 1.213 3.074.148.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.757-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
      </a>
    </div>
  );
}
