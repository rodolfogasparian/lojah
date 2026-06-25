"use client";

import { useState } from "react";
import { aprovarSolicitacao } from "@/app/admin/cupons/actions";

export function AprovarSolicitacaoButton({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await aprovarSolicitacao(requestId);
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao aprovar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <span className="px-3 py-1.5 rounded-lg text-sm font-semibold text-green-700 bg-green-100">
        Aprovado ✓
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#1a1a1a] transition-opacity hover:opacity-80 disabled:opacity-50"
      style={{ backgroundColor: "#cfee9a" }}
    >
      {loading ? "Aprovando..." : "Aprovar"}
    </button>
  );
}
