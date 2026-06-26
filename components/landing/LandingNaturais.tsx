"use client";

import { useState } from "react";
import { type LandingNaturaisData, defaultPageData } from "@/lib/landing-naturais-defaults";

export type { LandingNaturaisData };
export { defaultPageData };

const buildWhatsappLink = (phone: string, message?: string) => {
  const text = encodeURIComponent(message ?? "");
  return `https://wa.me/${phone.replace(/\D/g, "")}${text ? `?text=${text}` : ""}`;
};

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
          {(data.benefits.items || []).map((b) => (
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
            {(data.differentials.items || []).map((d) => (
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
          {(data.testimonials.items || []).map((t, i) => (
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
            {(data.gallery.items || []).map((p, i) => (
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
          {(data.values.items || []).map((v, i) => (
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
            {(data.kits.items || []).map((kit, i) => (
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
                    {(kit.highlights || []).map((h) => (
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

          {(data.footer.columns || []).map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-extrabold text-[#0f1f12]">{col.title}</h4>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
                {(col.links || []).map((l) => (
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
                {(data.footer.paymentMethods || []).map((p) => (
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
