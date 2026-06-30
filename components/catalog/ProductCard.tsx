"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Copy, Eye, MessageCircle, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
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
  productUrl: string;
  sellerName: string;
  qty: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  whatsappPhone: string;
  signupButtonText: string;
  signupButtonUrl: string;
  isShareMenuOpen: boolean;
  onToggleShareMenu: () => void;
  onCloseShareMenu: () => void;
  onSendOrder?: () => void;
  isConsultor?: boolean;
};

export function ProductCard({
  product,
  productUrl,
  sellerName,
  qty,
  onAdd,
  onRemove,
  whatsappPhone,
  signupButtonText,
  signupButtonUrl,
  isShareMenuOpen,
  onToggleShareMenu,
  onCloseShareMenu,
  onSendOrder,
  isConsultor,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Olá! Quero o ${product.name}.`)}`;

  useEffect(() => {
    if (!isShareMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        onCloseShareMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isShareMenuOpen, onCloseShareMenu]);

  async function handleNativeShare() {
    try {
      await navigator.share({
        title: product.name,
        text: `${product.name} — confira no catálogo de ${sellerName}`,
        url: productUrl,
      });
    } catch {
      // usuário cancelou
    }
    onCloseShareMenu();
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onCloseShareMenu();
    }, 2000);
  }

  return (
    <article className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden">
      <div className="relative aspect-square bg-white">
        {isConsultor && product.category?.name !== "ATL Services" && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
            50% OFF
          </span>
        )}
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
          <span className="block text-[9px] font-bold text-muted-foreground tracking-wider uppercase">
            {isConsultor ? "Preço consultor" : "Preço cliente"}
          </span>
          <span className="text-lg font-bold text-foreground">{product.price_client !== null ? brl(product.price_client) : "—"}</span>

          <div className="flex gap-1.5 mt-2.5">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 h-9 rounded-lg border border-border bg-card text-foreground text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-green-50 transition-colors">
              <MessageCircle className="size-3.5 text-green-500" /> Eu quero
            </a>
            <div className="relative" ref={shareMenuRef}>
              <button
                type="button"
                aria-label="Compartilhar"
                onClick={onToggleShareMenu}
                className="size-9 rounded-lg border border-border bg-card grid place-items-center text-muted-foreground hover:bg-gray-50 transition-colors"
              >
                <Share2 className="size-3.5" />
              </button>
              {isShareMenuOpen && (
                <div className="absolute bottom-full right-0 mb-1.5 z-20 bg-white border border-border rounded-xl shadow-lg overflow-hidden min-w-[185px]">
                  {typeof navigator !== "undefined" && navigator.share && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="size-3.5 text-muted-foreground" />
                      Compartilhar
                    </button>
                  )}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(product.name + " - " + productUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onCloseShareMenu}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="size-3.5 text-green-500" />
                    WhatsApp
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + " - " + productUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onCloseShareMenu}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="size-3.5 text-green-600" />
                    WhatsApp Business
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="size-3.5 text-muted-foreground" />
                    {copied ? "Copiado! ✓" : "Copiar link"}
                  </button>
                </div>
              )}
            </div>
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
