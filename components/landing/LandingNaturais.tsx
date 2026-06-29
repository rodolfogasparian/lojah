"use client";

import { useState } from "react";
import { type LandingNaturaisData, defaultPageData } from "@/lib/landing-naturais-defaults";

export type { LandingNaturaisData };
export { defaultPageData };

const buildWhatsappLink = (phone: string, message?: string) => {
  const text = encodeURIComponent(message ?? "");
  return `https://wa.me/${phone.replace(/\D/g, "")}${text ? `?text=${text}` : ""}`;
};

const neonGreen = { textShadow: "0 0 20px #00ff88, 0 0 40px #00ff88" };
const neonGreenBox = { boxShadow: "0 0 20px rgba(0,255,136,0.6)" };

export default function LandingNaturais({
  data = defaultPageData,
}: {
  data?: LandingNaturaisData;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const waLink = (msg?: string) =>
    buildWhatsappLink(data.whatsapp, msg ?? data.defaultWhatsappMessage);

  const galleryItems = data.gallery?.items || [];
  const lightboxPrev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + galleryItems.length) % galleryItems.length));
  const lightboxNext = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % galleryItems.length));

  return (
    <div
      className="min-h-screen w-full bg-[#fafaf7] text-[#1a1f1a] antialiased"
      style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}
    >
      {/* keyframes para pulso neon nos botões CTA */}
      <style>{`
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(0,255,136,0.5); }
          50% { box-shadow: 0 0 35px rgba(0,255,136,0.9), 0 0 70px rgba(0,255,136,0.3); }
        }
        .neon-pulse { animation: neonPulse 2.5s ease-in-out infinite; }
      `}</style>

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
          <div className="flex min-w-0 flex-col items-start gap-0.5">
            {data.brand.logoUrl ? (
              <img
                src={data.brand.logoUrl}
                alt={data.brand.name}
                className="h-12 shrink-0 object-contain"
              />
            ) : (
              <div className="grid h-12 w-12 shrink-0 place-items-center bg-[#cfee9a] text-[#0f3d1f] font-black text-2xl">
                {data.brand.name.charAt(0)}
              </div>
            )}
            <span className="text-xs text-neutral-500">
              Você está sendo atendido(a) por {data.brand.name}
            </span>
          </div>
          {/* CTA: mantém neon-pulse + bg #00ff88 */}
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="neon-pulse shrink-0 rounded-full bg-[#00ff88] px-4 py-2 text-xs font-bold text-[#0a1a0a] transition hover:scale-105 sm:text-sm"
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
              {/* CTA: mantém neon-pulse + #00ff88 */}
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#00ff88] bg-[#0f3d1f] px-6 py-4 text-base font-bold text-[#00ff88] transition-all hover:scale-105 sm:w-auto"
                style={{ textShadow: "0 0 10px #00ff88", boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
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
              +5.000 consultores(as) ativos
            </div>
          </div>
        </div>
      </section>

      {/* ---- Benefits ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeader title={data.benefits.title} subtitle={data.benefits.subtitle} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data.benefits.items || []).map((b) => (
            <div
              key={b.title}
              className="group overflow-hidden rounded-2xl border border-[#00ff88]/30 bg-[#0d1f0d] transition-all hover:-translate-y-1 hover:border-[#00ff88]"
            >
              {b.imageUrl ? (
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full object-contain max-h-48"
                />
              ) : (
                <div className="p-6 pb-0">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#00ff88]/15 text-2xl border border-[#00ff88]/30">
                    <span className="text-[#00ff88]">{b.icon ?? "✓"}</span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3
                  className="text-lg font-extrabold text-[#00ff88]"
                  style={{ textShadow: "0 0 10px #00ff88" }}
                >
                  {b.title}
                </h3>
                <p className="mt-1 text-sm text-white">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Differentials ---- */}
      {/* fundo verde escuro original; título mantém neon verde por estar sobre bg escuro */}
      <section className="bg-[#0f3d1f] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader
            title={data.differentials.title}
            subtitle={data.differentials.subtitle}
            neon="green"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(data.differentials.items || []).map((d) => (
              <div
                key={d.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
              >
                <h3 className="text-base font-extrabold">{d.title}</h3>
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
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {(data.testimonials.items || []).map((t, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-[#00ff88]/30 bg-[#0d1f0d]"
            >
              {t.videoUrl ? (
                <iframe
                  src={t.videoUrl}
                  title={t.name ?? `Depoimento ${i + 1}`}
                  width="100%"
                  height="250"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-black/5 text-sm text-neutral-400">
                  Vídeo não disponível
                </div>
              )}
              {(t.name || t.role) && (
                <div className="p-4">
                  {t.name && (
                    <p className="text-sm font-extrabold text-white">{t.name}</p>
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
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((p, i) => (
              <div
                key={i}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={p.imageUrl}
                  alt={p.alt ?? "Produto"}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Values / earnings ---- */}
      <section className="bg-[#0a1a0a] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={data.values.title} subtitle={data.values.subtitle} neon="green" />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {(data.values.items || []).map((v, i) => (
              <div
                key={v.title}
                className={`rounded-3xl border p-6 transition hover:-translate-y-1 ${
                  i === 1
                    ? "border-2 border-[#00ff88] bg-[#0d2b0d] text-white"
                    : "border-[#00ff88]/20 bg-[#0d1f0d] text-white"
                }`}
                style={i === 1 ? { boxShadow: "0 0 30px rgba(0,255,136,0.5)" } : undefined}
              >
                <h3 className="text-lg font-extrabold">{v.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{v.description}</p>
                {v.value && (
                  <p
                    className="mt-5 text-2xl font-black sm:text-3xl text-[#00ff88]"
                    style={neonGreen}
                  >
                    {v.value}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-neutral-400">
            *Valores ilustrativos baseados na média dos consultores(as) ativos.
          </p>
        </div>
      </section>

      {/* ---- Kits ---- */}
      <section className="bg-[#0d1f0d]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader title={data.kits.title} subtitle={data.kits.subtitle} titleClassName="text-white" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(data.kits.items || []).map((kit, i) => (
              <div
                key={kit.name}
                className={`flex flex-col overflow-hidden rounded-3xl border bg-[#0a1a0a] transition hover:-translate-y-1 hover:shadow-xl ${
                  i === 1
                    ? "border-2 border-[#00ffff]"
                    : "border-[#00ff88]/30"
                }`}
                style={i === 1 ? { boxShadow: "0 0 25px rgba(0,255,255,0.4)" } : undefined}
              >
                {kit.image && (
                  <div className="relative">
                    <img
                      src={kit.image}
                      alt={kit.name}
                      className="w-full object-contain max-h-52 rounded-t-xl"
                    />
                    {kit.badge && (
                      <span className="absolute left-4 top-4 rounded-full bg-[#00ff88] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0a1a0a]">
                        {kit.badge}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-extrabold text-white">{kit.name}</h3>
                  {kit.description && (
                    <p className="mt-1 text-sm text-neutral-300">{kit.description}</p>
                  )}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-bold ${i === 1 ? "text-[#00ffff]" : "text-[#00ff88]"}`}
                      style={{ textShadow: i === 1 ? "0 0 15px #00ffff" : "0 0 15px #00ff88" }}
                    >
                      {kit.price}
                    </span>
                    {kit.oldPrice && (
                      <span className="text-sm text-neutral-500 line-through">
                        {kit.oldPrice}
                      </span>
                    )}
                  </div>
                  <ul className="mt-4 flex flex-col gap-2 text-sm text-neutral-200">
                    {(kit.highlights || []).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-[#00ff88]/40 bg-[#00ff88]/15 text-[10px] text-[#00ff88]">
                          ✓
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {kit.catalogUrl ? (
                    <a
                      href={kit.catalogUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#00ff88] px-5 py-3 text-sm font-extrabold text-[#00ff88] transition hover:bg-[#00ff88] hover:text-[#0a1a0a] hover:scale-105"
                    >
                      🛒 Ver catálogo
                    </a>
                  ) : (
                    <a
                      href={waLink(kit.whatsappMessage)}
                      target="_blank"
                      rel="noreferrer"
                      className="neon-pulse mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00ff88] px-5 py-3 text-sm font-bold text-[#0a1a0a] transition hover:scale-105"
                    >
                      <span>💬</span> Quero esse kit
                    </a>
                  )}
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
          {(data.faq.items || []).map((f, i) => {
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
            {/* highlight: mantém neon verde por estar sobre bg escuro */}
            <span className="text-[#00ff88]" style={neonGreen}>produtos naturais</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Fale com nosso time pelo WhatsApp e receba todas as informações
            sobre como se tornar consultor(a).
          </p>
          {/* CTA: mantém neon-pulse */}
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="neon-pulse mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00ff88] px-6 py-4 text-base font-bold text-[#0a1a0a] transition hover:scale-105"
          >
            <span>💬</span> Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-black/5 bg-[#050f05]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              {data.brand.logoUrl ? (
                <img
                  src={data.brand.logoUrl}
                  alt={data.brand.name}
                  className="h-10 object-contain"
                />
              ) : (
                <div className="grid h-10 w-10 place-items-center bg-[#cfee9a] text-[#0f3d1f] font-black">
                  {data.brand.name.charAt(0)}
                </div>
              )}
            </div>
            {data.footer.description && (
              <p className="mt-3 text-sm text-neutral-400">{data.footer.description}</p>
            )}
          </div>

          {(data.footer.columns || []).map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-extrabold text-neutral-300">{col.title}</h4>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-400">
                {(col.links || []).map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="transition hover:text-[#00ff88]">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-extrabold text-neutral-300">Atendimento</h4>
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 px-3 py-2 text-xs font-bold text-[#00ff88] transition hover:bg-[#00ff88]/20"
            >
              💬 {data.footer.contact.whatsappLabel}
            </a>
          </div>
        </div>
        <div className="border-t border-white/5 px-4 py-4 text-center text-xs text-neutral-500 sm:px-6">
          {data.footer.copyright}
        </div>
        {/* spacer for mobile fixed bar */}
        <div className="h-20 sm:hidden" />
      </footer>

      {/* ---- Mobile fixed WhatsApp bar ---- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 p-3 backdrop-blur sm:hidden">
        {/* CTA: mantém neon */}
        <a
          href={waLink()}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00ff88] px-5 py-3 text-sm font-bold text-[#0a1a0a] shadow-lg"
          style={neonGreenBox}
        >
          <span>💬</span> Falar no WhatsApp
        </a>
      </div>

      {/* ---- Botão WhatsApp flutuante (desktop) ---- */}
      <a
        href={`https://wa.me/${data.whatsapp.replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
        className="hidden sm:flex fixed bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full transition hover:scale-110"
        style={{ backgroundColor: "#25D366", boxShadow: "0 0 20px rgba(37,211,102,0.6)" }}
      >
        <svg viewBox="0 0 32 32" fill="white" className="h-7 w-7">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.663 4.614 1.813 6.52L4 29l7.695-1.787A11.94 11.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22a9.94 9.94 0 01-5.07-1.387l-.364-.213-4.566 1.06 1.09-4.455-.236-.373A9.956 9.956 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.406-7.463c-.297-.148-1.757-.868-2.03-.968-.272-.099-.47-.148-.668.148-.198.296-.766.968-.938 1.166-.173.198-.347.222-.643.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.457.13-.605.134-.133.297-.347.446-.52.148-.174.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.148-.668-1.613-.916-2.208-.24-.579-.486-.5-.668-.51l-.57-.01c-.198 0-.52.074-.792.371-.272.296-1.04 1.017-1.04 2.48 0 1.463 1.065 2.876 1.213 3.074.148.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.757-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
      </a>

      {/* ---- Lightbox modal ---- */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white text-2xl hover:bg-white/40"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white text-2xl hover:bg-white/40"
          >
            ‹
          </button>
          <img
            src={galleryItems[lightboxIndex]?.imageUrl}
            alt={galleryItems[lightboxIndex]?.alt ?? ""}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white text-2xl hover:bg-white/40"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  neon,
  titleClassName,
}: {
  title: string;
  subtitle?: string;
  neon?: "green" | "cyan";
  titleClassName?: string;
}) {
  const titleStyle =
    neon === "green"
      ? { textShadow: "0 0 20px #00ff88, 0 0 40px #00ff88" }
      : neon === "cyan"
      ? { textShadow: "0 0 20px #00ffff, 0 0 40px #00ffff" }
      : undefined;

  const titleColor = titleClassName
    ? titleClassName
    : neon === "green"
    ? "text-[#00ff88]"
    : neon === "cyan"
    ? "text-[#00ffff]"
    : "text-[#0f1f12]";

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2
        className={`text-2xl font-black leading-tight sm:text-4xl ${titleColor}`}
        style={titleStyle}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm sm:text-base ${neon ? "text-neutral-300" : "text-neutral-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
