"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { criarLead } from "../plano/actions";

type Props = {
  sellerId: string;
  companyId: string;
  sellerName: string;
  sellerSlug: string;
  logoUrl: string;
};

export function ChamadaLanding({ sellerId, companyId, sellerName, sellerSlug, logoUrl }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", whatsapp: "", email: "" });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.whatsapp.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        await criarLead({
          company_id: companyId,
          seller_id: sellerId,
          nome: form.nome.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.replace(/\D/g, ""),
          caminho: "",
          modalidade: "",
          source: "Sistema Renda Inteligente",
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          page_url: typeof window !== "undefined" ? window.location.href : undefined,
        });
        router.push(`/${sellerSlug}/sistema`);
      } catch {
        setError("Erro ao enviar. Tente novamente.");
      }
    });
  }

  return (
    <div
      className="min-h-screen bg-[#0a1a0a] text-white"
      style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}
    >
      {/* Barra superior */}
      <div className="w-full bg-[#0f3d1f] text-[13px]">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 px-4 py-2 text-center">
          <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#cfee9a]" />
          <span>Vagas abertas para consultores(as) em todo o Brasil</span>
        </div>
      </div>

      {/* Header com logo */}
      <header className="border-b border-white/5 bg-[#0a1a0a]">
        <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-4">
          <img src={logoUrl} alt={sellerName} className="h-10 object-contain" />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-12 space-y-10">
        {/* Headline */}
        <div className="text-center space-y-3">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] rounded-full px-3 py-1">
            ISCA DIGITAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            <span className="text-white">Sistema</span>{" "}
            <span
              className="text-[#00ff88]"
              style={{ textShadow: "0 0 20px #00ff88, 0 0 40px #00ff88" }}
            >
              Renda Inteligente
            </span>
          </h1>
          <p className="text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Revenda de Serviços e Produtos com até 100% de lucro e Sistema de Afiliados
          </p>
        </div>

        {/* Vídeo YouTube */}
        <div className="overflow-hidden rounded-2xl border border-[#00ff88]/20 bg-black">
          <iframe
            src="https://www.youtube.com/embed/4sU6lZUQa3M"
            title="Sistema Renda Inteligente"
            width="100%"
            className="aspect-video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Formulário de captura */}
        <div className="bg-[#0d1f0d] rounded-2xl border border-[#00ff88]/20 p-6 space-y-5">
          <h2 className="text-lg font-bold text-white">
            Quero saber mais sobre o Sistema Renda Inteligente
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                Nome completo *
              </label>
              <input
                type="text"
                required
                value={form.nome}
                onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]/30 focus:border-[#00ff88]/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={form.whatsapp}
                onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]/30 focus:border-[#00ff88]/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                E-mail{" "}
                <span className="text-neutral-500 font-normal">(opcional)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="seu@email.com"
                className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]/30 focus:border-[#00ff88]/50"
              />
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-xl bg-[#00ff88] text-[#0a1a0a] font-bold text-base hover:brightness-90 transition-all disabled:opacity-60"
              style={{ boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
            >
              {isPending ? "Enviando…" : "Quero saber mais →"}
            </button>

            <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
              Ao continuar, você concorda com a{" "}
              <a href="/privacidade" className="underline hover:text-neutral-300">
                Política de Privacidade
              </a>{" "}
              e os{" "}
              <a href="/termos" className="underline hover:text-neutral-300">
                Termos de Uso
              </a>
              . Seus dados são usados apenas para contato pelo consultor indicado.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
