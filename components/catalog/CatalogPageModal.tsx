"use client";
import Image from "next/image";
import { ChevronLeft, ShoppingCart } from "lucide-react";

type Props = {
  isOpen: boolean;
  pageUrl: string | null;
  productName: string;
  onClose: () => void;
  onAddToCart: () => void;
};

export function CatalogPageModal({ isOpen, pageUrl, productName, onClose, onAddToCart }: Props) {
  if (!isOpen || !pageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white text-sm font-semibold"
        >
          <ChevronLeft className="size-5" />
          Voltar ao catálogo
        </button>
        <span className="text-white text-xs text-muted-foreground truncate max-w-[140px]">
          {productName}
        </span>
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

      {/* Botão flutuante carrinho */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4">
        <button
          onClick={() => { onAddToCart(); onClose(); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg text-sm font-bold"
        >
          <ShoppingCart className="size-4" />
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
