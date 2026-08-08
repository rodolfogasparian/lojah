import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

const LOGO_URL =
  "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/logo-atl-neon.png";

export const metadata: Metadata = {
  title: "Apresentação Sistema Renda Inteligente",
  description:
    "Revenda de Serviços e Produtos com até 100% de lucro e Sistema de Afiliados",
};

export default async function SistemaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const profile = await db.sellerProfile.findFirst({
    where: { slug },
    select: { id: true, name: true },
  });

  if (!profile) redirect("/login");

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
          <img src={LOGO_URL} alt={profile.name} className="h-10 object-contain" />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-12 space-y-10">
        {/* Título */}
        <div className="text-center space-y-3">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] rounded-full px-3 py-1">
            APRESENTAÇÃO
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
            src="https://www.youtube.com/embed/H9ehUgeo584"
            title="Apresentação Sistema Renda Inteligente"
            width="100%"
            className="aspect-video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <Link
            href={`/${slug}/plano`}
            className="w-full max-w-md py-4 rounded-xl bg-[#00ff88] text-[#0a1a0a] font-bold text-base text-center hover:brightness-90 transition-all"
            style={{ boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
          >
            Iniciar Plano (Diagnóstico Renda Inteligente) →
          </Link>
          <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
            Clique para iniciar o diagnóstico personalizado do seu plano de ação.
          </p>
        </div>
      </div>
    </div>
  );
}
