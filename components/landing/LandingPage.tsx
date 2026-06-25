"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Users,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Store,
  Smartphone,
  Share2,
  Shield,
  Menu,
  X,
  Globe,
  Star,
} from "lucide-react";

const DEMO_URL = "https://atlantica.lojah.app/br";
const WA_GERAL = `https://wa.me/5545999463907?text=${encodeURIComponent("Olá! Tenho interesse em conhecer a Lojah.app. Gostaria de agendar uma conversa.")}`;
const WA_INDIVIDUAL = `https://wa.me/5545999463907?text=${encodeURIComponent("Olá! Tenho interesse no plano Individual da Lojah.app. Gostaria de agendar uma conversa.")}`;
const WA_EQUIPE = `https://wa.me/5545999463907?text=${encodeURIComponent("Olá! Tenho interesse no plano Equipe da Lojah.app. Gostaria de agendar uma conversa.")}`;

const FEATURES = [
  {
    icon: Globe,
    title: "Link Exclusivo por Consultor",
    desc: "Cada consultor recebe uma URL personalizada para compartilhar com clientes. Simples, direto e profissional.",
  },
  {
    icon: Smartphone,
    title: "100% Mobile",
    desc: "O catálogo funciona perfeitamente em qualquer celular, sem necessidade de baixar nenhum aplicativo.",
  },
  {
    icon: Share2,
    title: "Fácil de Compartilhar",
    desc: "Um link, um clique. O consultor envia pelo WhatsApp e o cliente já abre o catálogo atualizado.",
  },
  {
    icon: ShoppingBag,
    title: "Catálogo Sempre Atualizado",
    desc: "A empresa atualiza os produtos uma vez e todos os catálogos dos consultores são atualizados automaticamente.",
  },
  {
    icon: Users,
    title: "Painel de Gestão",
    desc: "O administrador gerencia todos os consultores, cupons e assinaturas em um único painel centralizado.",
  },
  {
    icon: Shield,
    title: "Acesso Controlado",
    desc: "Sistema de cupons garante que apenas consultores ativos tenham catálogo publicado e visível.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Empresa contrata a plataforma",
    desc: "Configuramos a plataforma com a identidade visual, produtos e categorias da sua empresa.",
  },
  {
    step: "02",
    title: "Consultores recebem o acesso",
    desc: "Cada consultor recebe suas credenciais e ativa o catálogo com um cupom único.",
  },
  {
    step: "03",
    title: "Link é compartilhado",
    desc: "O consultor compartilha o link do catálogo pelo WhatsApp, Instagram ou onde preferir.",
  },
  {
    step: "04",
    title: "Cliente acessa e compra",
    desc: "O cliente visualiza os produtos e preços e entra em contato diretamente com o consultor.",
  },
];

const FOR_WHOM = [
  {
    icon: Store,
    title: "Empresas de Vendas Diretas",
    desc: "Que precisam digitalizar o catálogo e dar autonomia para cada consultor.",
  },
  {
    icon: Users,
    title: "Líderes de Equipe MLM",
    desc: "Que querem oferecer uma ferramenta profissional para toda a sua rede.",
  },
  {
    icon: ShoppingBag,
    title: "Distribuidoras",
    desc: "Com rede de revendedores que precisam de um canal de vendas moderno.",
  },
  {
    icon: Zap,
    title: "Negócios em Crescimento",
    desc: "Que querem escalar as vendas digitais sem depender de app ou marketplaces.",
  },
];

const FAQS = [
  {
    q: "Como funciona o catálogo digital?",
    a: "Cada consultor recebe um link único (ex: atlantica.lojah.app/seunome) com todos os produtos da empresa. O cliente acessa pelo celular, vê os preços e entra em contato diretamente com o consultor.",
  },
  {
    q: "Preciso baixar algum aplicativo?",
    a: "Não. A plataforma funciona 100% no navegador, tanto para o consultor acessar o painel quanto para o cliente visualizar o catálogo.",
  },
  {
    q: "Como os produtos são atualizados?",
    a: "A empresa atualiza os produtos no painel administrativo e todos os catálogos dos consultores são atualizados automaticamente em tempo real.",
  },
  {
    q: "Como os consultores ativam o catálogo?",
    a: "Cada consultor recebe um cupom de ativação. Ao inserir o cupom no painel, o catálogo é publicado pelo período contratado (7 dias, 30 dias ou 1 ano).",
  },
  {
    q: "Posso personalizar com a minha marca?",
    a: "Sim. A plataforma é configurada com o nome, logo e identidade visual da sua empresa. Cada consultor também pode personalizar seu perfil.",
  },
  {
    q: "Qual a diferença entre os planos?",
    a: "O plano Individual é para um único consultor. O plano Equipe é para empresas que gerenciam múltiplos consultores com um painel administrativo centralizado.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#166534" }}>
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">
              lojah<span style={{ color: "#166534" }}>.app</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#funcionalidades" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Como funciona</a>
            <a href="#precos" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Preços</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Ver demo
            </a>
            <a
              href={WA_GERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#166534" }}
            >
              Começar
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
            <a href="#funcionalidades" className="text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Funcionalidades</a>
            <a href="#como-funciona" className="text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Como funciona</a>
            <a href="#precos" className="text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>Preços</a>
            <a href="#faq" className="text-sm text-gray-700" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <a
              href={WA_GERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white text-center"
              style={{ backgroundColor: "#166534" }}
            >
              Começar
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="py-16 md:py-24 px-4" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
              style={{ backgroundColor: "#dcfce7", color: "#166534" }}
            >
              <Star className="w-3 h-3" />
              Plataforma de Catálogo Digital
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Catálogo digital para sua equipe de vendas
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Cada consultor com seu próprio link exclusivo. Produtos sempre atualizados, fácil de compartilhar e 100% no celular — sem app.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={WA_GERAL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl text-base font-semibold text-white text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#166534" }}
              >
                Quero meu catálogo
              </a>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl text-base font-semibold text-gray-700 text-center border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                Ver demonstração
              </a>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-56 h-[480px] rounded-[2.5rem] border-4 border-gray-800 bg-white shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10" />
                <div className="h-full flex flex-col pt-6" style={{ backgroundColor: "#f5f0e8" }}>
                  <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#cfee9a" }}>
                      <Store className="w-3 h-3" style={{ color: "#166534" }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-900 leading-none">Atlântica Natural</p>
                      <p className="text-[7px] text-gray-500 leading-none mt-0.5">Catálogo Digital</p>
                    </div>
                  </div>

                  <div className="px-3 py-2">
                    <div className="rounded-lg p-2 flex items-center gap-2" style={{ backgroundColor: "#cfee9a" }}>
                      <div
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[8px] font-bold"
                        style={{ color: "#166534" }}
                      >
                        RG
                      </div>
                      <div>
                        <p className="text-[8px] font-bold" style={{ color: "#166534" }}>Rodolfo Gasparian</p>
                        <p className="text-[7px] text-green-700">Consultor Atlântica</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden px-3">
                    <p className="text-[8px] font-bold text-gray-700 mb-2">Linha Ozonizada</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "Natuoz 20ml", price: "R$ 44,99", bg: "#d1fae5" },
                        { name: "Natuoz Hot", price: "R$ 65,99", bg: "#fef3c7" },
                        { name: "Natuoz Bucal", price: "R$ 65,99", bg: "#dbeafe" },
                        { name: "Rosa Mosqueta", price: "R$ 34,99", bg: "#fce7f3" },
                      ].map((p) => (
                        <div key={p.name} className="rounded-lg p-2 bg-white shadow-sm">
                          <div className="w-full h-10 rounded-md mb-1.5" style={{ backgroundColor: p.bg }} />
                          <p className="text-[7px] font-semibold text-gray-800 leading-tight">{p.name}</p>
                          <p className="text-[7px] font-bold mt-0.5" style={{ color: "#166534" }}>{p.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-3 py-2 bg-white border-t border-gray-100 mt-2">
                    <div
                      className="w-full py-1.5 rounded-lg text-[8px] font-bold text-white text-center"
                      style={{ backgroundColor: "#166534" }}
                    >
                      💬 Falar com Consultor
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-16 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-900">✅ Ativo</p>
                <p className="text-[9px] text-gray-500">atlantica.lojah.app/rg</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="py-8 border-y border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "100+", label: "Consultores ativos" },
              { value: "1.000+", label: "Produtos catalogados" },
              { value: "100%", label: "Mobile friendly" },
              { value: "0", label: "Apps para baixar" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-extrabold" style={{ color: "#166534" }}>{item.value}</span>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="funcionalidades" className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Tudo que seu time precisa para vender mais</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Plataforma completa para gestão de catálogos digitais com foco em vendas diretas e multinível.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#dcfce7" }}>
                  <Icon className="w-5 h-5" style={{ color: "#166534" }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Como funciona</h2>
            <p className="mt-3 text-gray-500">Do setup ao primeiro catálogo publicado em horas.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 text-white"
                  style={{ backgroundColor: "#166534" }}
                >
                  {step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Veja um catálogo real em funcionamento</h2>
          <p className="text-gray-500 mb-8">
            Acesse agora o catálogo da Atlântica Natural — nosso primeiro cliente — e veja como a experiência funciona na prática.
          </p>

          <div className="rounded-2xl overflow-hidden shadow-xl mx-auto max-w-sm">
            <div className="p-8 flex flex-col items-center gap-4" style={{ backgroundColor: "#166534" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#cfee9a" }}>
                <Store className="w-8 h-8" style={{ color: "#166534" }} />
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">Atlântica Natural</p>
                <p className="text-green-200 text-sm mt-1">Catálogo Digital Oficial</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 w-full text-center">
                <p className="text-white font-mono text-sm">atlantica.lojah.app/br</p>
              </div>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-semibold text-sm text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#cfee9a", color: "#166534" }}
              >
                Abrir Demonstração →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR WHOM ── */}
      <section className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Para quem é a Lojah?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FOR_WHOM.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl bg-white border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#dcfce7" }}>
                  <Icon className="w-6 h-6" style={{ color: "#166534" }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="precos" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Planos e Preços</h2>
            <p className="mt-3 text-gray-500">Escolha o plano ideal para o tamanho da sua operação.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-2xl border-2 border-gray-200 p-6 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Individual</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  R$ 97<span className="text-sm font-normal text-gray-500">/mês</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Para consultores independentes</p>
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  "1 catálogo exclusivo",
                  "Link personalizado",
                  "Painel do consultor",
                  "Produtos ilimitados",
                  "Suporte via WhatsApp",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#166534" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={WA_INDIVIDUAL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full py-3 rounded-xl font-semibold text-sm text-center border-2 border-gray-800 text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Começar Agora
              </a>
            </div>

            <div
              className="rounded-2xl border-2 p-6 flex flex-col gap-4 relative overflow-hidden"
              style={{ borderColor: "#166534", backgroundColor: "#f0fdf4" }}
            >
              <div
                className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: "#166534" }}
              >
                POPULAR
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#166534" }}>Equipe</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  R$ 297<span className="text-sm font-normal text-gray-500">/mês</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Para líderes e distribuidoras</p>
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  "Até 10 consultores",
                  "Painel administrativo",
                  "Gestão de cupons",
                  "Relatórios de atividade",
                  "Produtos ilimitados",
                  "Suporte prioritário",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#166534" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={WA_EQUIPE}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full py-3 rounded-xl font-semibold text-sm text-center text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#166534" }}
              >
                Falar com a Equipe
              </a>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            * Valores referentes ao setup inicial da Atlântica Natural, primeiro cliente da plataforma. O valor do setup para novas empresas é personalizado conforme necessidade.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Perguntas Frequentes</h2>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900 text-sm">{q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-3 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#166534" }}>
              <Store className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">
              lojah<span style={{ color: "#166534" }}>.app</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
              Ver demonstração
            </a>
            <a href={WA_GERAL} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
              Contato
            </a>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Lojah. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
