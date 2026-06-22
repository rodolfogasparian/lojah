"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function NewCouponPackForm() {
  const router = useRouter();
  const [type, setType] = useState<"ANNUAL" | "PROMOTIONAL">("ANNUAL");
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/cupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, quantity }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao criar pack.");
      return;
    }

    router.push("/admin/cupons");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="flex flex-col gap-2">
        <Label>Tipo de cupom</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType("ANNUAL")}
            className={`p-4 rounded-xl border-2 text-left transition-colors ${type === "ANNUAL" ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"}`}
          >
            <p className="font-bold text-sm">Anual</p>
            <p className="text-xs text-muted-foreground mt-1">Válido por 1 ano</p>
            <p className="text-xs font-semibold text-primary mt-2">R$ 67/unidade</p>
          </button>
          <button
            type="button"
            onClick={() => setType("PROMOTIONAL")}
            className={`p-4 rounded-xl border-2 text-left transition-colors ${type === "PROMOTIONAL" ? "border-amber-500 bg-amber-50" : "border-border hover:border-gray-300"}`}
          >
            <p className="font-bold text-sm">Promocional</p>
            <p className="text-xs text-muted-foreground mt-1">Válido por 30 dias</p>
            <p className="text-xs font-semibold text-amber-600 mt-2">Gratuito / Teste</p>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Quantidade de cupons</Label>
        <div className="flex gap-2">
          {[5, 10, 20, 50].map(q => (
            <button
              key={q}
              type="button"
              onClick={() => setQuantity(q)}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${quantity === q ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-gray-50"}`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Gerando cupons..." : `Gerar ${quantity} cupons`}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/cupons")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
