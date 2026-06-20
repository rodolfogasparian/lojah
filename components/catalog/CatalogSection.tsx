"use client";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CartBar } from "@/components/catalog/CartBar";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { useCart } from "@/hooks/useCart";

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
  const filteredProducts = useMemo(
    () =>
      activeCategory === "all"
        ? products
        : products.filter((product) => product.category?.id === activeCategory),
    [products, activeCategory]
  );

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
      <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
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
