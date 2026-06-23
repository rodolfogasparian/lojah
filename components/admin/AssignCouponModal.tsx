"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface Vendedor {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  packId: string;
  packType: string;
  quantity: number;
}

export function AssignCouponModal({ packId, packType, quantity }: Props) {
  const [open, setOpen] = useState(false);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open && vendedores.length === 0) {
      fetch("/api/admin/vendedores-lista")
        .then(r => r.json())
        .then(setVendedores);
    }
  }, [open]);

  async function handleAtribuir() {
    if (!selectedId) return;
    setLoading(true);
    const res = await fetch("/api/admin/cupons/atribuir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packId, sellerProfileId: selectedId }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        window.location.reload();
      }, 1000);
    }
  }

  const tipoLabel = packType === "PROMOTIONAL" ? "Promocional 30 dias" : "Anual 1 ano";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
      >
        <UserPlus className="inline size-3 mr-1" />
        Atribuir
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
            <h2 className="font-bold text-lg">Atribuir pack a vendedor</h2>
            <p className="text-sm text-muted-foreground">
              Pack: <span className="font-medium">{tipoLabel}</span> — {quantity} cupons
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Selecionar vendedor</label>
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione...</option>
                {vendedores.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (@{v.slug})</option>
                ))}
              </select>
            </div>

            {success && (
              <p className="text-sm text-green-600 font-medium text-center">✓ Pack atribuído com sucesso!</p>
            )}

            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleAtribuir} disabled={!selectedId || loading}>
                {loading ? "Salvando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
