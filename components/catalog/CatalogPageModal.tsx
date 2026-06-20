"use client";
import Image from "next/image";
import { ChevronLeft, ShoppingCart, Send } from "lucide-react";

type Props = {
  isOpen: boolean;
  pageUrl: string | null;
  productName: string;
  qty: number;
  onClose: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onSendOrder: () => void;
};

export function CatalogPageModal({ isOpen, pageUrl, productName, qty, onClose, onAdd, onRemove, onSendOrder }: Props) {
  if (!isOpen || !pageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white text-sm font-semibold hover:text-gray-300 transition-colors"
        >
          <ChevronLeft className="size-5" />
          Voltar ao catálogo
        </button>
        <span className="text-white/70 text-xs truncate max-w-[160px]">{productName}</span>
      </div>

      {/* Imagem fullscreen */}
      <div className="flex-1 relative overflow-hidden">
        <Image
          src={pageUrl}
          alt={productName}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      {/* Botões flutuantes na base */}
      <div className="bg-black/80 backdrop-blur-sm px-4 py-4 flex flex-col gap-2">
        {/* Controle de quantidade + enviar pedido */}
        <div className="flex gap-2">
          {qty > 0 ? (
            <div className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-between px-3">
              <button
                onClick={onRemove}
                className="size-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors grid place-items-center font-bold text-lg"
              >
                −
              </button>
              <span className="text-sm font-bold">{qty} no pedido</span>
              <button
                onClick={onAdd}
                className="size-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors grid place-items-center font-bold text-lg"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="size-4" />
              Adicionar ao pedido
            </button>
          )}

          <button
            onClick={onSendOrder}
            className="h-11 px-4 rounded-xl bg-[#25D366] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#1ebe57] transition-colors"
          >
            <Send className="size-4" />
            Enviar pedido
          </button>
        </div>

        {/* Voltar */}
        <button
          onClick={onClose}
          className="w-full h-10 rounded-xl border border-white/20 text-white/70 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          ← Voltar ao catálogo
        </button>
      </div>
    </div>
  );
}
