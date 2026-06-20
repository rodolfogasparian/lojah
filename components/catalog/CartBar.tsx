"use client";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { brl } from "@/lib/format";

type Props = { count: number; total: number; onCheckout: () => void };

export function CartBar({ count, total, onCheckout }: Props) {
  if (count <= 0) return null;
  return (
    <div className="fixed bottom-3 inset-x-0 z-40 px-3">
      <div className="mx-auto max-w-3xl">
        <div className="bg-primary text-primary-foreground rounded-2xl pl-4 pr-2 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-10 rounded-xl bg-white/10 grid place-items-center shrink-0">
              <ShoppingBag className="size-5" />
              <span className="absolute -top-1 -right-1 size-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center border-2 border-primary">{count}</span>
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-[10px] uppercase tracking-wider opacity-80 font-semibold">{count} {count === 1 ? "item" : "itens"} no carrinho</p>
              <p className="font-bold text-base">{brl(total)}</p>
            </div>
          </div>
          <button type="button" onClick={onCheckout} className="h-12 px-4 rounded-xl bg-accent text-accent-foreground font-bold text-sm flex items-center gap-2">
            <MessageCircle className="size-4" /> Enviar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
