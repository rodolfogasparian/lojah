import { Check } from "lucide-react";

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
          <div className="flex items-center gap-2 mb-6">
            <img
              src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-preto.jpg"
              alt="Atlântica Natural"
              className="w-9 h-9 rounded-lg object-contain bg-white p-0.5"
            />
            <span className="text-sm font-medium text-gray-600">Atlântica Natural × Lojah</span>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 bg-green-50 text-green-700">
                ★ Catálogo digital exclusivo
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 leading-tight mb-4">
                Seu catálogo Atlântica Natural no celular, sempre atualizado
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Link personalizado, cartão virtual e página de revenda — tudo em um só lugar para você vender mais pelo WhatsApp.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href={CHECKOUT_INDIVIDUAL} target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-[#166534] text-white hover:bg-green-800 transition-colors">
                    🛒 Quero meu catálogo
                  </button>
                </a>
                <a href={CATALOGO_MODELO} target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                    👁️ Ver modelo ao vivo
                  </button>
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/catalogo-3.png"
                alt="Catálogo Atlântica Natural"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DEMO AO VIVO */}
      <section className="px-4 py-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center text-xl">👁️</div>
            <div>
              <p className="text-sm font-medium text-gray-900">Veja como fica o seu catálogo</p>
              <p className="text-xs text-gray-500 mt-0.5">Acesse um catálogo real funcionando agora mesmo</p>
            </div>
          </div>
          <a href={CATALOGO_MODELO} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors bg-transparent">
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
          {[
            ["🔗", "Link personalizado", "atlantica.lojah.app/seu-nome"],
            ["💬", "Botão WhatsApp", "Clientes falam direto com você"],
            ["🪪", "Cartão virtual", "Compartilhe seu contato digital"],
            ["🔄", "Sempre atualizado", "Novos produtos aparecem automaticamente"],
            ["👥", "Página de revenda", "Recrute novos consultores"],
            ["📱", "Funciona no celular", "100% responsivo e rápido"],
          ].map(([icon, title, desc]) => (
            <div key={title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="w-9 h-9 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mb-3 text-lg">{icon}</div>
              <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
              <p className="text-xs text-gray-500">{desc}</p>
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
              <div key={n} className="rounded-3xl border border-gray-200 bg-white p-5 text-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center mx-auto mb-3 text-sm font-medium">{n}</div>
                <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">Planos</p>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">Escolha seu plano</h2>
        <div className="grid md:grid-cols-2 gap-4">

          {/* Individual */}
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs text-gray-500 mb-4">Catálogo individual</p>
            <p className="text-xs text-gray-400 line-through mb-0.5">de R$ 197</p>
            <p className="text-xs font-medium text-[#166534] mb-1">por apenas</p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-4xl font-semibold text-gray-900">R$ 67</span>
              <span className="text-sm text-gray-500">/ano</span>
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
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-50 text-green-700">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <a href={CHECKOUT_INDIVIDUAL} target="_blank" rel="noopener noreferrer">
              <button className="w-full py-3 rounded-full text-sm font-medium bg-[#166534] text-white hover:bg-green-800 transition-colors">
                Quero meu catálogo
              </button>
            </a>
          </div>

          {/* Pack */}
          <div className="rounded-[2rem] p-6 relative bg-gradient-to-br from-[#166534] to-green-900 text-white shadow-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium px-4 py-1 rounded-full whitespace-nowrap bg-white text-[#166534]">
              Mais econômico
            </div>
            <p className="text-xs text-green-200 mb-4">Pack 10 catálogos</p>
            <p className="text-xs text-green-300 line-through mb-0.5">de R$ 1.970</p>
            <p className="text-xs font-medium text-green-200 mb-1">por apenas</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-semibold">R$ 370</span>
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
                  <span className="text-white/90">{f}</span>
                </li>
              ))}
            </ul>
            <a href={CHECKOUT_PACK} target="_blank" rel="noopener noreferrer">
              <button className="w-full py-3 rounded-full text-sm font-medium bg-white text-[#166534] hover:bg-green-50 transition-colors">
                Quero o pack
              </button>
            </a>
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#166534] px-4 py-14 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-xl font-semibold tracking-tight text-white mb-2">Ficou com alguma dúvida?</h2>
          <p className="text-sm text-green-100 mb-6">Nossa equipe está pronta para te ajudar</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium mx-auto bg-white text-[#166534] hover:bg-green-50 transition-colors">
              💬 Falar no WhatsApp
            </button>
          </a>
        </div>
      </section>

    </main>
  );
}
