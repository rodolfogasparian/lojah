import { Check, Link2, MessageCircle, CreditCard, RefreshCw, Users, Smartphone } from "lucide-react";

const WHATSAPP_ADMIN = "45999463907";
const CATALOGO_MODELO = "https://atlantica.lojah.app/br";
const CHECKOUT_INDIVIDUAL = "https://pay.hotmart.com/M106478390Y";
const CHECKOUT_PACK = "https://pay.hotmart.com/M106478390Y?off=o2ppbpn2";

export const metadata = {
  title: "Catálogo Digital Atlântica Natural | Lojah",
  description: "Tenha seu catálogo Atlântica Natural no celular, sempre atualizado. Link personalizado, cartão virtual e página de revenda — tudo em um só lugar.",
};

export default function AtlanticaSalesPage() {
  const whatsappMsg = encodeURIComponent("Olá! Tenho interesse em ter meu catálogo digital da Atlântica Natural. Pode me ajudar?");
  const whatsappUrl = `https://wa.me/${WHATSAPP_ADMIN}?text=${whatsappMsg}`;

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-gray-50 px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-8 mb-6">
            <img
              src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-branco.png"
              alt="Atlântica Natural"
              className="h-14 object-contain"
            />
            <img
              src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-loja-preto.png"
              alt="Lojah"
              className="h-14 object-contain"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 bg-[#00ff88]/15 text-[#0f3d1f] border border-[#00ff88]/30">
                ★ Catálogo digital exclusivo
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 leading-tight mb-4">
                Seu catálogo Atlântica Natural no celular, sempre atualizado
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Link personalizado, cartão virtual e página de revenda — tudo em um só lugar para você vender mais pelo WhatsApp.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href="/cadastro">
                  <button
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-[#0f3d1f] text-white border border-[#00ff88] hover:scale-105 transition-all"
                    style={{ boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
                  >
                    🛒 Quero meu catálogo
                  </button>
                </a>
                <a href={CATALOGO_MODELO} target="_blank" rel="noopener noreferrer">
                  <button
                    className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium bg-[#0f3d1f] text-[#00ff88] border border-[#00ff88] animate-pulse-slow"
                    style={{ textShadow: "0 0 10px #00ff88" }}
                  >
                    👁️ Ver modelo ao vivo
                  </button>
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/venda-mais.png"
                alt="Catálogo Atlântica Natural"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DEMO AO VIVO */}
      <section className="px-4 py-6 max-w-5xl mx-auto">
        <div className="bg-[#0d1f0d] rounded-2xl border border-[#00ff88]/30 p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center text-xl">👁️</div>
            <div>
              <p className="text-sm font-medium text-white">Veja como fica o seu catálogo</p>
              <p className="text-xs text-neutral-300 mt-0.5">Acesse um catálogo real funcionando agora mesmo</p>
            </div>
          </div>
          <a href={CATALOGO_MODELO} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#0f3d1f] text-[#00ff88] border border-[#00ff88] hover:scale-105 transition-all">
              ↗ Abrir catálogo modelo
            </button>
          </a>
        </div>
      </section>

      {/* VÍDEO */}
      <section className="px-4 pb-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <iframe
              src="https://www.youtube.com/embed/kCkbqfeU6zo"
              title="Apresentação do Catálogo Atlântica Natural"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">Benefícios</p>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">Tudo que você precisa para vender mais</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {([
            [Link2,         "Link personalizado",  "atlantica.lojah.app/seu-nome"],
            [MessageCircle, "Botão WhatsApp",       "Clientes falam direto com você"],
            [CreditCard,    "Cartão virtual",       "Compartilhe seu contato digital"],
            [RefreshCw,     "Sempre atualizado",    "Novos produtos aparecem automaticamente"],
            [Users,         "Página de revenda",    "Recrute novos consultores"],
            [Smartphone,    "Funciona no celular",  "100% responsivo e rápido"],
          ] as const).map(([Icon, title, desc]) => (
            <div key={title} className="rounded-3xl border border-[#00ff88]/30 bg-[#0d1f0d] p-6">
              <div className="bg-[#00ff88]/10 rounded-2xl p-3 w-fit mb-3">
                <Icon className="h-6 w-6 text-[#00ff88]" />
              </div>
              <p className="text-sm font-medium text-[#00ff88] mb-1">{title}</p>
              <p className="text-xs text-white">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-green-700 uppercase mb-2">Como funciona</p>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">Simples assim</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["1", "Cadastre-se", "Crie sua conta em menos de 2 minutos"],
              ["2", "Personalize", "Adicione foto, bio e seus dados de contato"],
              ["3", "Compartilhe", "Envie seu link no WhatsApp e venda mais"],
            ].map(([n, title, desc]) => (
              <div key={n} className="rounded-3xl border border-[#00ff88]/30 bg-[#0d1f0d] p-5 text-center">
                <div
                  className="w-8 h-8 rounded-full bg-[#0f3d1f] text-white border border-[#00ff88] flex items-center justify-center mx-auto mb-3 text-sm font-medium"
                  style={{ boxShadow: "0 0 15px rgba(0,255,136,0.4)" }}
                >{n}</div>
                <p className="text-sm font-medium text-[#0f3d1f] mb-1">{title}</p>
                <p className="text-xs text-neutral-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section className="bg-[#0a1a0a] px-4 py-12">
        <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase mb-2">Planos</p>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">Escolha seu plano</h2>
        <div className="grid md:grid-cols-2 gap-4">

          {/* Individual */}
          <div className="rounded-[2rem] border border-[#00ff88]/30 bg-[#0d1f0d] p-6">
            <p className="text-xs text-neutral-400 mb-4">Catálogo individual</p>
            <p className="text-xs text-neutral-500 line-through mb-0.5">de R$ 197</p>
            <p className="text-xs font-medium text-neutral-400 mb-1">por apenas</p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-4xl font-semibold text-[#00ff88]" style={{ textShadow: "0 0 10px #00ff88" }}>R$ 67</span>
              <span className="text-sm text-neutral-400">/ano</span>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                "1 catálogo exclusivo",
                "Link personalizado",
                "Painel do consultor",
                "Produtos ilimitados",
                "Suporte via WhatsApp",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#00ff88]/10 text-[#00ff88]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-neutral-200">{f}</span>
                </li>
              ))}
            </ul>
            <a href="/cadastro">
              <button
                className="w-full py-3 mt-6 rounded-full text-sm font-medium bg-[#0f3d1f] text-[#00ff88] border border-[#00ff88] hover:scale-105 transition-all"
                style={{ boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
              >
                Quero meu catálogo
              </button>
            </a>
          </div>

          {/* Pack */}
          <div
            className="rounded-[2rem] p-6 relative bg-[#0d1f0d] border border-[#00ff88] text-white"
            style={{ boxShadow: "0 0 25px rgba(0,255,136,0.3)" }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium px-4 py-1 rounded-full whitespace-nowrap bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30">
              Mais econômico
            </div>
            <p className="text-xs text-green-200 mb-4">Pack 10 catálogos</p>
            <p className="text-xs text-green-300 line-through mb-0.5">de R$ 1.970</p>
            <p className="text-xs font-medium text-[#00ff88] mb-1">por apenas</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-semibold text-[#00ff88]" style={{ textShadow: "0 0 15px #00ff88" }}>R$ 370</span>
            </div>
            <p className="text-xs text-green-200 mb-3">R$ 37 por catálogo</p>
            <div className="rounded-xl bg-white/10 p-3 mb-4">
              <p className="text-xs text-green-100 leading-relaxed">
                Você recebe 10 vouchers para repassar o catálogo à sua equipe. O lucro da diferença é seu.
              </p>
            </div>
            <ul className="mt-2 mb-6 space-y-3">
              {[
                "10 vouchers para sua equipe",
                "Cada consultor com link exclusivo",
                "Painel administrativo completo",
                "Gestão de cupons e ativações",
                "A diferença do preço de venda é seu lucro",
                "Suporte prioritário",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-white">{f}</span>
                </li>
              ))}
            </ul>
            <a href={CHECKOUT_PACK} target="_blank" rel="noopener noreferrer">
              <button className="w-full py-3 rounded-full text-sm font-medium bg-white text-[#0f3d1f] hover:bg-green-50 transition-colors">
                Quero o pack
              </button>
            </a>
          </div>

        </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#0f3d1f] px-4 py-14 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-4xl mb-4">💬</div>
          <h2
            className="text-xl font-semibold tracking-tight text-white mb-2"
            style={{ textShadow: "0 0 20px #00ff88" }}
          >
            Ficou com alguma dúvida?
          </h2>
          <p className="text-sm text-green-100 mb-6">Nossa equipe está pronta para te ajudar</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium mx-auto bg-[#0f3d1f] text-white border border-[#00ff88] hover:scale-105 transition-all"
              style={{ boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
            >
              💬 Falar no WhatsApp
            </button>
          </a>
        </div>
      </section>

    </main>
  );
}
