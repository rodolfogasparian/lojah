import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const FALLBACK_IMAGE = "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-branco.png";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const produto = await db.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });

  return {
    title: produto ? `${produto.name} | Atlântica Natural` : "Atlântica Natural",
    description: produto?.description ?? "Confira este produto no catálogo Atlântica Natural",
    openGraph: {
      title: produto?.name ?? "Atlântica Natural",
      description: produto?.description ?? "",
      images: [{ url: produto?.image_url ?? FALLBACK_IMAGE, width: 800, height: 800 }],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;

  const produto = await db.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });

  if (!produto) {
    redirect(`/${slug}`);
  }

  redirect(`/${slug}?categoria=${encodeURIComponent(produto.category?.name ?? "")}`);
}
