"use client";

import { useState } from "react";

/* ============================================================================
 * LandingNaturais — Landing page de captação de representantes/consultores
 * de produtos naturais.
 *
 * - React puro + Tailwind CSS
 * - Componente único, autocontido, sem rotas, sem API, sem dependências extras
 * - Todos os textos, imagens, vídeos e links via props (com defaults editáveis)
 * - Fonte: Nunito (carregada via <link> no root da aplicação)
 * - Paleta: verde claro #cfee9a, verde escuro, branco, preto suave, neutros
 * ========================================================================== */

type Benefit = { icon?: string; title: string; description: string };
type Differential = { icon?: string; title: string; description: string };
type Testimonial = { videoUrl: string; name?: string; role?: string; thumbnail?: string };
type Product = { image: string; name?: string };
type ValueCard = { title: string; description: string; value?: string; icon?: string };
type Kit = {
  name: string;
  image: string;
  price: string;
  oldPrice?: string;
  highlights: string[];
  whatsappMessage?: string;
  badge?: string;
};
type FAQItem = { question: string; answer: string };
type FooterLink = { label: string; href: string };

export type LandingNaturaisData = {
  whatsapp: string; // ex: "5511999999999"
  defaultWhatsappMessage?: string;
  brand: {
    name: string;
    logoUrl?: string;
  };
  topBar: {
    text: string;
    region?: string;
  };
  hero: {
    badge?: string;
    title: string;
    highlight?: string;
    subtitle: string;
    imageUrl: string;
    ctaLabel: string;
    bullets?: string[];
  };
  benefits: {
    title: string;
    subtitle?: string;
    items: Benefit[];
  };
  differentials: {
    title: string;
    subtitle?: string;
    items: Differential[];
  };
  testimonials: {
    title: string;
    subtitle?: string;
    items: Testimonial[];
  };
  gallery: {
    title: string;
    subtitle?: string;
    items: Product[];
  };
  values: {
    title: string;
    subtitle?: string;
    items: ValueCard[];
  };
  kits: {
    title: string;
    subtitle?: string;
    items: Kit[];
  };
  faq: {
    title: string;
    subtitle?: string;
    items: FAQItem[];
  };
  footer: {
    description?: string;
    columns: { title: string; links: FooterLink[] }[];
    contact: { whatsappLabel: string; email?: string; hours?: string };
    paymentMethods: string[];
    copyright: string;
  };
};

/* -------------------------------------------------------------------------- */
/*  Default content                                                            */
/* -------------------------------------------------------------------------- */

export const defaultPageData: LandingNaturaisData = {
  whatsapp: "5511999999999",
  defaultWhatsappMessage:
    "Olá! Quero ser representante e receber mais informações sobre os kits.",
  brand: {
    name: "Vida Natural",
    logoUrl: "",
  },
  topBar: {
    text: "Vagas abertas para representantes em todo o Brasil",
    region: "Atendimento nacional",
  },
  hero: {
    badge: "Renda extra com produtos naturais",
    title: "Seja representante e fature de",
    highlight: "casa com produtos naturais",
    subtitle:
      "Ganhe revendendo produtos com alta demanda, loja virtual pronta, catálogo digital e suporte completo. Comece com baixo investimento.",
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "Quero ser representante agora",
    bullets: [
      "Lucro de até 150% na revenda",
      "Loja virtual + catálogo prontos",
      "Suporte e treinamentos inclusos",
    ],
  },
  benefits: {
    title: "Tudo o que você recebe",
    subtitle: "Um negócio completo, pronto para começar hoje mesmo.",
    items: [
      {
        icon: "💰",
        title: "Lucro na revenda",
        description: "Margens generosas com produtos de altíssima procura.",
      },
      {
        icon: "🛒",
        title: "Loja virtual pronta",
        description: "Sua loja online configurada para vender 24h por dia.",
      },
      {
        icon: "📱",
        title: "Catálogo digital",
        description: "Compartilhe seus produtos no WhatsApp em 1 clique.",
      },
      {
        icon: "🎨",
        title: "Material de divulgação",
        description: "Artes prontas para Instagram, WhatsApp e Stories.",
      },
      {
        icon: "🚀",
        title: "Baixo investimento",
        description: "Comece pequeno e escale conforme suas vendas.",
      },
      {
        icon: "🤝",
        title: "Suporte e treinamentos",
        description: "Mentorias semanais e equipe sempre pronta para ajudar.",
      },
    ],
  },
  differentials: {
    title: "Por que escolher a gente",
    subtitle: "Mais que produtos, um negócio digital completo.",
    items: [
      {
        icon: "✅",
        title: "Produtos naturais certificados",
        description: "Linhas exclusivas com qualidade comprovada.",
      },
      {
        icon: "⚡",
        title: "Entrega rápida",
        description: "Logística ágil para você nunca perder uma venda.",
      },
      {
        icon: "📈",
        title: "Marca em crescimento",
        description: "Mercado bilionário e em alta no Brasil.",
      },
      {
        icon: "🏆",
        title: "Comunidade ativa",
        description: "Mais de 5.000 representantes em todo o país.",
      },
    ],
  },
  testimonials: {
    title: "Histórias reais de quem já começou",
    subtitle: "Veja o que nossos representantes estão conquistando.",
    items: [
      {
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        name: "Mariana S.",
        role: "Representante há 8 meses",
      },
      {
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        name: "Carlos M.",
        role: "Representante há 1 ano",
      },
      {
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        name: "Juliana R.",
        role: "Representante há 6 meses",
      },
    ],
  },
  gallery: {
    title: "Conheça alguns produtos",
    subtitle: "Linhas naturais que vendem sozinhas.",
    items: [
      {
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
        name: "Óleo essencial",
      },
      {
        image:
          "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=600&q=80",
        name: "Suplemento natural",
      },
      {
        image:
          "https://images.unsplash.com/photo-1612540139150-4e7fc6e7b9b3?auto=format&fit=crop&w=600&q=80",
        name: "Chá funcional",
      },
      {
        image:
          "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?auto=format&fit=crop&w=600&q=80",
        name: "Cosmético natural",
      },
      {
        image:
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
        name: "Linha skincare",
      },
      {
        image:
          "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?auto=format&fit=crop&w=600&q=80",
        name: "Aromaterapia",
      },
    ],
  },
  values: {
    title: "Quanto você pode ganhar",
    subtitle: "Estimativas com base nos resultados dos nossos representantes.",
    items: [
      {
        icon: "🌱",
        title: "Iniciante",
        description: "Vendendo nas horas livres, no WhatsApp e redes sociais.",
        value: "R$ 1.500/mês",
      },
      {
        icon: "🚀",
        title: "Dedicado",
        description: "Algumas horas por dia, com catálogo e divulgação ativa.",
        value: "R$ 4.000/mês",
      },
      {
        icon: "👑",
        title: "Profissional",
        description: "Full-time, com equipe e estratégia de tráfego.",
        value: "R$ 10.000+/mês",
      },
    ],
  },
  kits: {
    title: "Escolha seu kit inicial",
    subtitle: "Comece hoje com o kit perfeito para o seu momento.",
    items: [
      {
        name: "Kit Iniciante",
        image:
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=700&q=80",
        price: "R$ 297",
        oldPrice: "R$ 497",
        badge: "Mais acessível",
        highlights: [
          "10 produtos best-sellers",
          "Catálogo digital",
          "Acesso ao grupo VIP",
        ],
        whatsappMessage: "Olá! Quero o Kit Iniciante, pode me ajudar?",
      },
      {
        name: "Kit Premium",
        image:
          "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=700&q=80",
        price: "R$ 597",
        oldPrice: "R$ 997",
        badge: "Mais vendido",
        highlights: [
          "25 produtos variados",
          "Loja virtual personalizada",
          "Material de divulgação",
          "Treinamento exclusivo",
        ],
        whatsappMessage: "Olá! Quero o Kit Premium, pode me ajudar?",
      },
      {
        name: "Kit Master",
        image:
          "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=700&q=80",
        price: "R$ 997",
        oldPrice: "R$ 1.797",
        badge: "Maior margem",
        highlights: [
          "50+ produtos premium",
          "Loja virtual + catálogo",
          "Mentoria individual",
          "Prioridade na logística",
        ],
        whatsappMessage: "Olá! Quero o Kit Master, pode me ajudar?",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes",
    subtitle: "Tudo que você precisa saber antes de começar.",
    items: [
      {
        question: "Preciso ter experiência com vendas?",
        answer:
          "Não. Te ensinamos do zero, com treinamentos práticos e suporte direto pelo WhatsApp.",
      },
      {
        question: "Quanto tempo leva para começar a vender?",
        answer:
          "Em até 7 dias após receber seu kit você já pode estar realizando suas primeiras vendas.",
      },
      {
        question: "Existe mensalidade ou taxa?",
        answer:
          "Não cobramos mensalidade. Você investe apenas no seu kit inicial.",
      },
      {
        question: "Posso revender online e fisicamente?",
        answer:
          "Sim! Você pode vender presencialmente, no WhatsApp, redes sociais e pela sua loja virtual.",
      },
      {
        question: "Como funciona o envio dos produtos?",
        answer:
          "Você pode trabalhar com estoque próprio ou solicitar envios sob demanda diretamente para o cliente.",
      },
    ],
  },
  footer: {
    description:
      "Vida Natural — oportunidade real para quem quer empreender com produtos naturais.",
    columns: [
      {
        title: "Institucional",
        links: [
          { label: "Sobre nós", href: "#" },
          { label: "Política de privacidade", href: "#" },
          { label: "Termos de uso", href: "#" },
        ],
      },
      {
        title: "Para representantes",
        links: [
          { label: "Como funciona", href: "#" },
          { label: "Kits disponíveis", href: "#" },
          { label: "Treinamentos", href: "#" },
        ],
      },
    ],
    contact: {
      whatsappLabel: "Fale conosco no WhatsApp",
      email: "contato@vidanatural.com.br",
      hours: "Seg a Sex, 9h às 18h",
    },
    paymentMethods: ["Pix", "Visa", "Mastercard", "Boleto", "Elo"],
    copyright: "© 2026 Vida Natural. Todos os direitos reservados.",
  },
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const buildWhatsappLink = (phone: string, message?: string) => {
  const text = encodeURIComponent(message ?? "");
  return `https://wa.me/${phone.replace(/\D/g, "")}${text ? `?text=${text}` : ""}`;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function LandingNaturais({
  data = defaultPageData,
}: {
  data?: LandingNaturaisData;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const waLink = (msg?: string) =>
    buildWhatsappLink(data.whatsapp, msg ?? data.defaultWhatsappMessage);

  return (
    <div
      className="min-h-screen w-full bg-[#fafaf7] text-[#1a1f1a] antialiased"
      style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}
    >
      {/* ---- Top attention bar ---- */}
      <div className="w-full bg-[#0f3d1f] text-white text-[13px] sm:text-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center">
          <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#cfee9a]" />
          <span className="truncate">
            {data.topBar.text}
            {data.topBar.region && (
              <span className="hidden sm:inline opacity-75"> • {data.topBar.region}</span>
            )}
          </span>
        </div>
      </div>

      {/* ---- Navbar ---- */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            {data.brand.logoUrl ? (
              <img
                src={data.brand.logoUrl}
                alt={data.brand.name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#cfee9a] text-[#0f3d1f] font-black">
                {data.brand.name.charAt(0)}
              </div>
            )}
            <span className="truncate text-base font-extrabold text-[#0f3d1f] sm:text-lg">
              {data.brand.name}
            </span>
          </div>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full bg-[#0f3d1f] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0a2d16] sm:text-sm"
          >
            Quero começar
          </a>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 400px at 80% -10%, #cfee9a 0%, transparent 60%), radial-gradient(700px 350px at -10% 90%, #e6f7c7 0%, transparent 55%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="flex flex-col gap-5 text-center lg:text-left">
            {data.hero.badge && (
              <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#0f3d1f]/15 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0f3d1f] shadow-sm lg:mx-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0f3d1f]" />
                {data.hero.badge}
              </span>
            )}
            <h1 className="text-3xl font-black leading-[1.1] text-[#0f1f12] sm:text-4xl lg:text-5xl">
              {data.hero.title}{" "}
              {data.hero.highlight && (
                <span className="relative inline-block">
                  <span className="relative z-10">{data.hero.highlight}</span>
                  <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-full bg-[#cfee9a]" />
                </span>
              )}
            </h1>
            <p className="text-base text-neutral-600 sm:text-lg">
              {data.hero.subtitle}
            </p>

            {data.hero.bullets && data.hero.bullets.length > 0 && (
              <ul className="mx-auto flex flex-col gap-2 text-sm text-[#0f3d1f] sm:text-base lg:mx-0">
                {data.hero.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#cfee9a] text-[#0f3d1f]">
                      ✓
                    </span>
                    <span className="font-semibold">{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f3d1f] px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-[#0f3d1f]/20 transition hover:-translate-y-0.5 hover:bg-[#0a2d16] sm:w-auto"
              >
                <span>💬</span>
                {data.hero.ctaLabel}
              </a>
              <span className="text-xs text-neutral-500">
                Resposta em poucos minutos no WhatsApp
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[#cfee9a]/40 blur-2xl" />
            <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl shadow-[#0f3d1f]/10">
              <img
                src={data.hero.imageUrl}
                alt="Produtos naturais"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-bold text-[#0f3d1f] shadow-md sm:text-sm">
              <span className="text-base">⭐</span>
              +5.000 representantes ativos
            </div>
          </div>
        </div>
      </section>

      {/* ---- Benefits ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeader title={data.benefits.title} subtitle={data.benefits.subtitle} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.benefits.items.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#cfee9a] text-2xl">
                {b.icon ?? "✓"}
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-[#0f1f12]">{b.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Differentials ---- */}
      <section className="bg-[#0f3d1f] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader
            title={data.differentials.title}
            subtitle={data.differentials.subtitle}
            light
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.differentials.items.map((d) => (
              <div
                key={d.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#cfee9a] text-xl text-[#0f3d1f]">
                  {d.icon ?? "✓"}
                </div>
                <h3 className="mt-4 text-base font-extrabold">{d.title}</h3>
                <p className="mt-1 text-sm text-white/70">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Testimonials / Videos ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeader
          title={data.testimonials.title}
          subtitle={data.testimonials.subtitle}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.testimonials.items.map((t, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
            >
              <div className="aspect-video w-full bg-black/5">
                <iframe
                  src={t.videoUrl}
                  title={t.name ?? `Depoimento ${i + 1}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {(t.name || t.role) && (
                <div className="p-4">
                  {t.name && (
                    <p className="text-sm font-extrabold text-[#0f1f12]">{t.name}</p>
                  )}
                  {t.role && <p className="text-xs text-neutral-500">{t.role}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---- Gallery ---- */}
      <section className="bg-[#f4f8ec]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader title={data.gallery.title} subtitle={data.gallery.subtitle} />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {data.gallery.items.map((p, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
              >
                <img
                  src={p.image}
                  alt={p.name ?? "Produto"}
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {p.name && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-[11px] font-bold text-white sm:text-xs">{p.name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Values / earnings ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeader title={data.values.title} subtitle={data.values.subtitle} />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {data.values.items.map((v, i) => (
            <div
              key={v.title}
              className={`rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                i === 1
                  ? "border-[#0f3d1f] bg-[#0f3d1f] text-white"
                  : "border-black/5 bg-white text-[#0f1f12]"
              }`}
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                  i === 1 ? "bg-[#cfee9a] text-[#0f3d1f]" : "bg-[#cfee9a]"
                }`}
              >
                {v.icon ?? "💎"}
              </div>
              <h3 className="mt-4 text-lg font-extrabold">{v.title}</h3>
              <p
                className={`mt-1 text-sm ${
                  i === 1 ? "text-white/80" : "text-neutral-600"
                }`}
              >
                {v.description}
              </p>
              {v.value && (
                <p
                  className={`mt-5 text-2xl font-black sm:text-3xl ${
                    i === 1 ? "text-[#cfee9a]" : "text-[#0f3d1f]"
                  }`}
                >
                  {v.value}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-neutral-500">
          *Valores ilustrativos baseados na média dos representantes ativos.
        </p>
      </section>

      {/* ---- Kits ---- */}
      <section className="bg-[#f4f8ec]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader title={data.kits.title} subtitle={data.kits.subtitle} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.kits.items.map((kit, i) => (
              <div
                key={kit.name}
                className={`flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  i === 1 ? "border-[#0f3d1f] ring-2 ring-[#cfee9a]" : "border-black/5"
                }`}
              >
                <div className="relative">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="aspect-[5/4] w-full object-cover"
                  />
                  {kit.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-[#0f3d1f] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#cfee9a]">
                      {kit.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-extrabold text-[#0f1f12]">{kit.name}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#0f3d1f]">{kit.price}</span>
                    {kit.oldPrice && (
                      <span className="text-sm text-neutral-400 line-through">
                        {kit.oldPrice}
                      </span>
                    )}
                  </div>
                  <ul className="mt-4 flex flex-col gap-2 text-sm text-neutral-700">
                    {kit.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#cfee9a] text-[10px] text-[#0f3d1f]">
                          ✓
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={waLink(kit.whatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f3d1f] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#0a2d16]"
                  >
                    <span>💬</span> Quero esse kit
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeader title={data.faq.title} subtitle={data.faq.subtitle} />
        <div className="mt-10 flex flex-col gap-3">
          {data.faq.items.map((f, i) => {
            const open = openFaq === i;
            return (
              <div
                key={f.question}
                className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-sm font-extrabold text-[#0f1f12] sm:text-base">
                    {f.question}
                  </span>
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#cfee9a] text-[#0f3d1f] transition ${
                      open ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {open && (
                  <div className="border-t border-black/5 px-5 py-4 text-sm text-neutral-600">
                    {f.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#0f3d1f] p-8 text-center text-white shadow-xl sm:p-14">
          <h2 className="text-2xl font-black sm:text-4xl">
            Comece hoje seu negócio com{" "}
            <span className="text-[#cfee9a]">produtos naturais</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Fale com nosso time pelo WhatsApp e receba todas as informações
            sobre como se tornar representante.
          </p>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#cfee9a] px-6 py-4 text-base font-extrabold text-[#0f3d1f] transition hover:-translate-y-0.5 hover:bg-white"
          >
            <span>💬</span> Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              {data.brand.logoUrl ? (
                <img
                  src={data.brand.logoUrl}
                  alt={data.brand.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#cfee9a] text-[#0f3d1f] font-black">
                  {data.brand.name.charAt(0)}
                </div>
              )}
              <span className="text-base font-extrabold text-[#0f3d1f]">
                {data.brand.name}
              </span>
            </div>
            {data.footer.description && (
              <p className="mt-3 text-sm text-neutral-600">{data.footer.description}</p>
            )}
          </div>

          {data.footer.columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-extrabold text-[#0f1f12]">{col.title}</h4>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:text-[#0f3d1f]">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-extrabold text-[#0f1f12]">Atendimento</h4>
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#cfee9a] px-3 py-2 text-xs font-bold text-[#0f3d1f] hover:bg-[#bfe57a]"
            >
              💬 {data.footer.contact.whatsappLabel}
            </a>
            {data.footer.contact.email && (
              <p className="mt-3 text-sm text-neutral-600">
                {data.footer.contact.email}
              </p>
            )}
            {data.footer.contact.hours && (
              <p className="mt-1 text-xs text-neutral-500">
                {data.footer.contact.hours}
              </p>
            )}
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                Pagamentos
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.footer.paymentMethods.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-black/10 bg-[#f4f8ec] px-2 py-1 text-[11px] font-bold text-[#0f3d1f]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-black/5 px-4 py-4 text-center text-xs text-neutral-500 sm:px-6">
          {data.footer.copyright}
        </div>
        {/* spacer for mobile fixed bar */}
        <div className="h-20 sm:hidden" />
      </footer>

      {/* ---- Mobile fixed WhatsApp bar ---- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 p-3 backdrop-blur sm:hidden">
        <a
          href={waLink()}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f3d1f] px-5 py-3 text-sm font-extrabold text-white shadow-lg"
        >
          <span>💬</span> Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  title,
  subtitle,
  light = false,
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2
        className={`text-2xl font-black leading-tight sm:text-4xl ${
          light ? "text-white" : "text-[#0f1f12]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-sm sm:text-base ${
            light ? "text-white/70" : "text-neutral-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
