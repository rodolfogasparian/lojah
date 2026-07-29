"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AtivarCupomForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/ativar-cupom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim().toUpperCase() }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Cupom inválido.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.refresh(), 1500);
  }

  if (success) {
    return (
      <p className="text-sm font-semibold text-green-700 text-center py-2">
        ✅ Conta ativada com sucesso!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="ex: ATLA-X7K2-AB3D"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
          className="flex-1 rounded-lg border px-3 py-2.5 text-sm font-mono tracking-widest bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3d1f]/40"
          style={{ borderColor: "#d1d5db" }}
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "#0f3d1f" }}
        >
          {loading ? "..." : "Ativar"}
        </button>
      </div>
    </form>
  );
}
