"use client";

import { useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import { solicitarPack } from "@/app/painel/cupons/actions";

const PIX_KEY = "whapspro@gmail.com";
const WHATSAPP_ADMIN = "5545999463907";

const PACK_INFO: Record<string, { label: string; duracao: string }> = {
  PROMOTIONAL: { label: "Promocional",  duracao: "7 dias" },
  ANNUAL:      { label: "Anual",        duracao: "1 ano" },
};

interface Props {
  tipo: "PROMOTIONAL" | "ANNUAL";
  preco: string;
  sellerSlug: string;
}

export function ModalSolicitarPack({ tipo, preco, sellerSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const info = PACK_INFO[tipo];

  async function handleJaPaguei() {
    setLoading(true);
    try {
      await solicitarPack(tipo);
    } catch (err) {
      console.error("Erro ao registrar solicitação:", err);
    }

    const msg = encodeURIComponent(
      `Olá! Acabei de pagar o pack ${info.label} de 10 cupons (R$${preco}). Meu usuário é ${sellerSlug}. Aguardo a liberação.`
    );
    window.open(`https://wa.me/${WHATSAPP_ADMIN}?text=${msg}`, "_blank");
    setOpen(false);
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 px-5 rounded-lg font-semibold text-sm text-[#1a1a1a] text-center transition-opacity hover:opacity-80"
        style={{ backgroundColor: "#cfee9a" }}
      >
        Solicitar pack
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">

            <div>
              <h2 className="font-bold text-lg">Solicitar Pack {info.label}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Pague via PIX e avise o administrador para liberação.
              </p>
            </div>

            {/* Resumo */}
            <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#f5f0e8" }}>
              <p className="text-sm text-[#555]">
                10 cupons × {info.duracao} ={" "}
                <span className="font-bold text-[#1a1a1a]">R$ {preco}</span>
              </p>
            </div>

            {/* PIX */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wide">
                Chave PIX
              </p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 border border-border">
                <span className="flex-1 font-mono text-sm font-bold">{PIX_KEY}</span>
                <CopyButton text={PIX_KEY} />
              </div>
              <p className="text-2xl font-bold text-center text-[#1a1a1a] mt-1">
                R$ {preco}
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleJaPaguei}
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-sm text-[#1a1a1a] transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: "#cfee9a" }}
              >
                {loading ? "Registrando..." : "Já paguei — Avisar no WhatsApp"}
              </button>
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-sm text-[#555] bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
