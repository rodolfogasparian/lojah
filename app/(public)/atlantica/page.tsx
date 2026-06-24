import Link from "next/link";

const WHATSAPP_ADMIN = "45999463907";
const CATALOGO_MODELO = "https://atlantica.lojah.app/br";
const CADASTRO_URL = "https://atlantica.lojah.app/cadastro";

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
      <section style={{ background: "#cfee9a" }} className="px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <img
              src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-preto.jpg"
              alt="Atlântica Natural"
              className="w-9 h-9 rounded-lg object-contain bg-white p-0.5"
            />
            <span style={{ color: "#3d7a32" }} className="text-sm font-medium">Atlântica Natural × Lojah</span>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div style={{ background: "rgba(45,90,39,0.12)", color: "#1e3d1a" }} className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4">
                ★ Catálogo digital exclusivo
              </div>
              <h1 style={{ color: "#1e3d1a" }} className="text-3xl md:text-4xl font-medium leading-tight mb-4">
                Seu catálogo Atlântica Natural no celular, sempre atualizado
              </h1>
              <p style={{ color: "#3d7a32" }} className="text-sm leading-relaxed mb-6">
                Link personalizado, cartão virtual e página de revenda — tudo em um só lugar para você vender mais pelo WhatsApp.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href={CADASTRO_URL}>
                  <button style={{ background: "#2d5a27", color: "#fff" }} className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium">
                    🛒 Quero meu catálogo
                  </button>
                </Link>
                <a href={CATALOGO_MODELO} target="_blank" rel="noopener noreferrer">
                  <button style={{ background: "#3d7a32", color: "#fff" }} className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm">
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
        <div style={{ border: "0.5px solid #c8e89a" }} className="bg-white rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div style={{ background: "#e8f7c8" }} className="w-11 h-11 rounded-full flex items-center justify-center text-xl">👁️</div>
            <div>
              <p className="text-sm font-medium">Veja como fica o seu catálogo</p>
              <p className="text-xs text-gray-500 mt-0.5">Acesse um catálogo real funcionando agora mesmo</p>
            </div>
          </div>
          <a href={CATALOGO_MODELO} target="_blank" rel="noopener noreferrer">
            <button style={{ color: "#2d5a27", border: "1.5px solid #2d5a27" }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-transparent">
              ↗ Abrir catálogo modelo
            </button>
          </a>
        </div>
      </section>

      {/* VÍDEO */}
      <section className="px-4 pb-6 max-w-5xl mx-auto">
        <div style={{ border: "0.5px solid #c8e89a" }} className="bg-white rounded-xl p-5">
          <div style={{ background: "#e8f7c8", border: "1.5px dashed #9fd45a" }} className="rounded-lg h-52 flex items-center justify-center flex-col gap-3">
            <div style={{ background: "#2d5a27" }} className="w-14 h-14 rounded-full flex items-center justify-center text-2xl">▶️</div>
            <p style={{ color: "#1e3d1a" }} className="text-sm font-medium">Veja o catálogo em ação</p>
            <span style={{ color: "#3d7a32" }} className="text-xs">Vídeo demonstrativo — em breve</span>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">Benefícios</p>
        <h2 className="text-2xl font-medium mb-6">Tudo que você precisa para vender mais</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ["🔗", "Link personalizado", "atlantica.lojah.app/seu-nome"],
            ["💬", "Botão WhatsApp", "Clientes falam direto com você"],
            ["🪪", "Cartão virtual", "Compartilhe seu contato digital"],
            ["🔄", "Sempre atualizado", "Novos produtos aparecem automaticamente"],
            ["👥", "Página de revenda", "Recrute novos consultores"],
            ["📱", "Funciona no celular", "100% responsivo e rápido"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: "#f5f0e8" }} className="rounded-xl p-4">
              <div style={{ background: "#e8f7c8" }} className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-lg">{icon}</div>
              <p className="text-sm font-medium mb-1">{title}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ background: "#cfee9a" }} className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <p style={{ color: "#3d7a32" }} className="text-xs font-medium tracking-widest uppercase mb-2">Como funciona</p>
          <h2 style={{ color: "#1e3d1a" }} className="text-2xl font-medium mb-6">Simples assim</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["1", "Cadastre-se", "Crie sua conta em menos de 2 minutos"],
              ["2", "Personalize", "Adicione foto, bio e seus dados de contato"],
              ["3", "Compartilhe", "Envie seu link no WhatsApp e venda mais"],
            ].map(([n, title, desc]) => (
              <div key={n} style={{ background: "#f5f0e8" }} className="rounded-xl p-5 text-center">
                <div style={{ background: "#2d5a27", color: "#cfee9a" }} className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-medium">{n}</div>
                <p style={{ color: "#1e3d1a" }} className="text-sm font-medium mb-1">{title}</p>
                <p style={{ color: "#3d7a32" }} className="text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">Planos</p>
        <h2 className="text-2xl font-medium mb-6">Escolha seu plano</h2>
        <div className="grid md:grid-cols-2 gap-4">

          {/* Individual */}
          <div style={{ background: "#fffde7" }} className="rounded-xl p-6">
            <p className="text-xs text-gray-500 mb-4">Catálogo individual</p>
            <p className="text-xs text-gray-400 line-through mb-0.5">de R$ 197</p>
            <p style={{ color: "#2d5a27" }} className="text-xs font-medium mb-1">por apenas</p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-4xl font-medium">R$ 67</span>
              <span className="text-sm text-gray-500">/ano</span>
            </div>
            <Link href={CADASTRO_URL}>
              <button style={{ background: "#2d5a27", color: "#fff", border: "none" }} className="w-full py-3 rounded-lg text-sm font-medium">
                Quero meu catálogo
              </button>
            </Link>
          </div>

          {/* Pack */}
          <div style={{ border: "2px solid #2d5a27" }} className="bg-white rounded-xl p-6 relative">
            <div style={{ background: "#2d5a27", color: "#cfee9a" }} className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium px-4 py-1 rounded-full whitespace-nowrap">
              Mais econômico
            </div>
            <p className="text-xs text-gray-500 mb-4">Pack 10 catálogos</p>
            <p className="text-xs text-gray-400 line-through mb-0.5">de R$ 1.970</p>
            <p style={{ color: "#2d5a27" }} className="text-xs font-medium mb-1">por apenas</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-medium">R$ 370</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">R$ 37 por catálogo</p>
            <div style={{ background: "#e8f7c8" }} className="rounded-lg p-3 mb-4">
              <p style={{ color: "#1e3d1a" }} className="text-xs leading-relaxed">
                Você recebe 10 vouchers para repassar o catálogo à sua equipe. O lucro da diferença é seu.
              </p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <button style={{ background: "#2d5a27", color: "#cfee9a" }} className="w-full py-3 rounded-lg text-sm font-medium">
                Quero o pack
              </button>
            </a>
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: "#cfee9a" }} className="px-4 py-14 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-4xl mb-4">💬</div>
          <h2 style={{ color: "#1e3d1a" }} className="text-xl font-medium mb-2">Ficou com alguma dúvida?</h2>
          <p style={{ color: "#3d7a32" }} className="text-sm mb-6">Nossa equipe está pronta para te ajudar</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <button style={{ background: "#fff", color: "#25a244" }} className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium mx-auto">
              💬 Falar no WhatsApp
            </button>
          </a>
        </div>
      </section>

    </main>
  );
}
