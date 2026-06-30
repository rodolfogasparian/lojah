"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { gerarPayloadPix } from "@/lib/pix";

const PIX_CHAVE = "whapspro@gmail.com";
const PIX_NOME = "Lojah App";
const PIX_CIDADE = "São Paulo";
const PIX_VALOR = 67.0;

type Props = {
  sellerName: string;
  sellerWhatsapp: string | null;
  sellerSlug: string;
};

export function CatalogSuspendedModal({ sellerName, sellerWhatsapp, sellerSlug }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [cupom, setCupom] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const payload = gerarPayloadPix({
      chave: PIX_CHAVE,
      nome: PIX_NOME,
      cidade: PIX_CIDADE,
      valor: PIX_VALOR,
      descricao: "Catalogo Atlantica Natural",
    });
    QRCode.toDataURL(payload, { width: 220, margin: 2 }).then(setQrDataUrl);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ativar-cupom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cupom.trim(), slug: sellerSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Cupom inválido ou já utilizado.");
      } else {
        window.location.reload();
      }
    } catch {
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const whatsappDigits = sellerWhatsapp?.replace(/\D/g, "");
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent("Olá! Gostaria de renovar minha assinatura do catálogo.")}`
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#0d1f0d] border border-[#00ff88]/40 rounded-2xl max-w-sm w-full p-6 flex flex-col gap-4"
        style={{ boxShadow: "0 0 40px rgba(0,255,136,0.2)" }}
      >
        {/* Cabeçalho */}
        <div className="text-center">
          <p className="text-white font-bold text-base">⏸️ Catálogo Temporariamente Pausado</p>
          <p className="text-neutral-300 text-sm mt-1">
            Renove sua assinatura para reativar o catálogo
          </p>
        </div>

        {/* QR Code PIX */}
        <div className="flex flex-col items-center gap-2">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code PIX"
              className="rounded-lg border-4 border-white"
              width={200}
              height={200}
            />
          ) : (
            <div className="w-[200px] h-[200px] rounded-lg border-4 border-white bg-white/10 animate-pulse" />
          )}
          <p className="text-neutral-400 text-xs text-center">Chave PIX: {PIX_CHAVE}</p>
          <p
            className="text-[#00ff88] font-bold text-xl text-center"
            style={{ textShadow: "0 0 10px #00ff88" }}
          >
            R$ 67,00/ano
          </p>
        </div>

        {/* Campo de cupom */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={cupom}
              onChange={(e) => setCupom(e.target.value.toUpperCase())}
              placeholder="Inserir código de cupom"
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-neutral-500 border border-white/20 text-sm focus:outline-none focus:border-[#00ff88]/60"
            />
            <button
              type="submit"
              disabled={loading || !cupom.trim()}
              className="px-4 py-2 rounded-lg bg-[#0f3d1f] text-[#00ff88] border border-[#00ff88]/60 text-sm font-semibold hover:bg-[#1a5c2e] transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Ativar"}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </form>

        {/* Botão WhatsApp */}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] text-white rounded-xl py-3 w-full text-center font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            💬 Falar com {sellerName}
          </a>
        )}
      </div>
    </div>
  );
}
