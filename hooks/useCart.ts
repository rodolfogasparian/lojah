"use client";
import { useCallback, useMemo, useState } from "react";
import { brl } from "@/lib/format";

type Product = { id: string; name: string; price_client: number | null };
export type CartState = Record<string, number>;

export function useCart(products: Product[], initial: CartState = {}) {
  const [cart, setCart] = useState<CartState>(initial);
  const add = useCallback((id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 })), []);
  const remove = useCallback((id: string) => setCart((c) => { const next = { ...c, [id]: (c[id] ?? 0) - 1 }; if (next[id] <= 0) delete next[id]; return next; }), []);
  const clear = useCallback(() => setCart({}), []);
  const count = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const total = useMemo(() => Object.entries(cart).reduce((sum, [id, qty]) => { const p = products.find((x) => x.id === id); return sum + (p?.price_client ? Number(p.price_client) * qty : 0); }, 0), [cart, products]);

  const sendWhatsAppOrder = useCallback((phone: string) => {
    const lines = Object.entries(cart).map(([id, q]) => { const p = products.find((x) => x.id === id); return p ? `• ${q}x ${p.name} — ${brl(Number(p.price_client) * q)}` : ""; }).filter(Boolean).join("\n");
    const text = `Olá! Quero finalizar meu pedido:\n\n${lines}\n\nTotal: ${brl(total)}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }, [cart, products, total]);

  return { cart, add, remove, clear, count, total, sendWhatsAppOrder };
}
