"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CartBar } from "@/components/catalog/CartBar";
import { useCart } from "@/hooks/useCart";

const QUICK_CATEGORIES = [
  "Perfumes Bortoletto 15ml",
  "Perfumes Bortoletto 100ml",
  "Linha Ozonizada",
  "Suplementos e Nutracêuticos",
];

type CatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  price_client: number | null;
  image_url: string | null;
  category: { id: string; name: string } | null;
};

type Props = {
  products: CatalogProduct[];
  whatsappPhone: string;
  signupButtonText: string;
  signupButtonUrl: string;
  sellerName: string;
  pageUrl: string;
};

export function CatalogSection({
  products,
  whatsappPhone,
  signupButtonText,
  signupButtonUrl,
  sellerName,
  pageUrl,
}: Props) {
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const product of products) {
      if (product.category) seen.set(product.category.id, product.category.name);
    }
    return [{ id: "all", label: "Todos" }, ...[...seen.entries()].map(([id, label]) => ({ id, label }))];
  }, [products]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let result =
      activeCategory === "all"
        ? products
        : products.filter((product) => product.category?.id === activeCategory);

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((product) => product.name.toLowerCase().includes(query));
    }

    return result;
  }, [products, activeCategory, searchQuery]);

  const { cart, add, remove, count, total, sendWhatsAppOrder } = useCart(products);

  async function handleShare(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} — confira no catálogo de ${sellerName}`,
          url: pageUrl,
        });
      } catch {
        // usuário cancelou o compartilhamento
      }
      return;
    }

    await navigator.clipboard.writeText(pageUrl);
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl pb-20">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full pl-9 pr-3 py-2 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="w-full border border-primary rounded-full px-3 py-2 bg-white text-sm focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {QUICK_CATEGORIES.map((label) => {
          const category = categories.find((c) => c.label === label);
          if (!category) return null;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className="px-3 py-1 rounded-full border border-primary text-primary bg-white text-xs font-medium transition-colors hover:bg-primary hover:text-white cursor-pointer"
            >
              {label}
            </button>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Nenhum produto encontrado.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            qty={cart[product.id] ?? 0}
            onAdd={add}
            onRemove={remove}
            whatsappPhone={whatsappPhone}
            signupButtonText={signupButtonText}
            signupButtonUrl={signupButtonUrl}
            onShare={handleShare}
          />
        ))}
      </div>
      <CartBar count={count} total={total} onCheckout={() => sendWhatsAppOrder(whatsappPhone)} />
    </div>
  );
}
