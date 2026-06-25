"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type PackType = "ANNUAL" | "PROMOTIONAL" | "MONTHLY";

interface Props {
  isSuperAdmin: boolean;
}

const PACK_OPTIONS = [
  {
    type: "ANNUAL" as PackType,
    label: "Anual",
    validade: "Válido por 1 ano",
    preco: "R$ 67/unidade",
    selectedClass: "border-primary bg-primary/5",
    precoClass: "text-primary",
    superAdminOnly: false,
  },
  {
    type: "PROMOTIONAL" as PackType,
    label: "7 dias",
    validade: "Válido por 7 dias",
    preco: "R$ 1/unidade",
    selectedClass: "border-amber-500 bg-amber-50",
    precoClass: "text-amber-600",
    superAdminOnly: false,
  },
  {
    type: "MONTHLY" as PackType,
    label: "30 dias",
    validade: "Válido por 30 dias",
    preco: "R$ 4/unidade",
    selectedClass: "border-blue-500 bg-blue-50",
    precoClass: "text-blue-600",
    superAdminOnly: true,
  },
];

export function NewCouponPackForm({ isSuperAdmin }: Props) {
  const router = useRouter();
  const [type, setType] = useState<PackType>("ANNUAL");
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

  const visibleOptions = PACK_OPTIONS.filter(
    (o) => !o.superAdminOnly || isSuperAdmin
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <Label>Tipo de cupom</Label>
        <div className="flex flex-col gap-3">
          {visibleOptions.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => setType(opt.type)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                type === opt.type
                  ? opt.selectedClass
                  : "border-border hover:border-gray-300"
              }`}
            >
              <p className="font-bold text-sm">{opt.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{opt.validade}</p>
              <p className={`text-xs font-semibold mt-2 ${opt.precoClass}`}>
                {opt.preco}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Quantidade de cupons</Label>
        <div className="flex gap-2">
          {[5, 10, 20, 50].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuantity(q)}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                quantity === q
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-gray-50"
              }`}
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
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/cupons")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
