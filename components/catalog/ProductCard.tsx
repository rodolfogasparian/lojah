"use client";
import { useState } from "react";
import Image from "next/image";
import { Eye, MessageCircle, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import { brl } from "@/lib/format";
import { CatalogPageModal } from "./CatalogPageModal";

type Props = {
  product: {
    id: string;
    name: string;
    description: string | null;
    category: { name: string } | null;
    price_client: number | null;
    image_url: string | null;
    catalogPageUrl?: string | null;
  };
  qty: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  whatsappPhone: string;
  signupButtonText: string;
  signupButtonUrl: string;
  onShare?: (id: string) => void;
  onSendOrder?: () => void;
};

export function ProductCard({
  product,
  qty,
  onAdd,
  onRemove,
  whatsappPhone,
  signupButtonText,
  signupButtonUrl,
  onShare,
  onSendOrder,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Olá! Quero o ${product.name}.`)}`;

  return (
    <article className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden">
      <div className="relative aspect-square bg-white">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-contain p-3" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
            {product.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        {product.catalogPageUrl && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="absolute bottom-2 right-2 bg-white/95 px-2 py-1 rounded-md border border-border text-[10px] font-semibold text-muted-foreground flex items-center gap-1 hover:bg-white hover:shadow-md transition-all"
          >
            <Eye className="size-3" /> catálogo
          </button>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        {product.category && (
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[9px] font-bold rounded">{product.category.name}</span>
          </div>
        )}
        <h3 className="text-[15px] font-semibold leading-tight mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed mb-3">{product.description}</p>
        )}

        <div className="mt-auto">
          <span className="block text-[9px] font-bold text-muted-foreground tracking-wider uppercase">Preço cliente</span>
          <span className="text-lg font-bold text-foreground">{product.price_client !== null ? brl(product.price_client) : "—"}</span>

          <div className="flex gap-1.5 mt-2.5">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 h-9 rounded-lg border border-border bg-card text-foreground text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-green-50 transition-colors">
              <MessageCircle className="size-3.5 text-green-500" /> Eu quero
            </a>
            <button type="button" aria-label="Compartilhar" onClick={() => onShare?.(product.id)} className="size-9 rounded-lg border border-border bg-card grid place-items-center text-muted-foreground hover:bg-gray-50 transition-colors">
              <Share2 className="size-3.5" />
            </button>
          </div>

          {qty > 0 ? (
            <div className="mt-2 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-between px-2">
              <button type="button" onClick={() => onRemove(product.id)} className="size-7 rounded-md bg-white/10 hover:bg-white/20 transition-colors grid place-items-center"><Minus className="size-3.5" /></button>
              <span className="text-xs font-bold">{qty} no carrinho</span>
              <button type="button" onClick={() => onAdd(product.id)} className="size-7 rounded-md bg-white/10 hover:bg-white/20 transition-colors grid place-items-center"><Plus className="size-3.5" /></button>
            </div>
          ) : (
            <button type="button" onClick={() => onAdd(product.id)} className="w-full mt-2 h-10 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity">
              <ShoppingCart className="size-3.5" /> Adicionar ao carrinho
            </button>
          )}

          <a href={signupButtonUrl} target="_blank" rel="noreferrer" className="w-full mt-1 h-8 text-[10px] text-muted-foreground font-medium flex items-center justify-center">
            {signupButtonText}
          </a>
        </div>
      </div>

      <CatalogPageModal
        isOpen={modalOpen}
        pageUrl={product.catalogPageUrl ?? null}
        productName={product.name}
        qty={qty}
        onClose={() => setModalOpen(false)}
        onAdd={() => onAdd(product.id)}
        onRemove={() => onRemove(product.id)}
        onSendOrder={() => { onSendOrder?.(); setModalOpen(false); }}
      />
    </article>
  );
}
