import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getCompanyFromHost } from "@/lib/tenant";
import { Card, CardContent } from "@/components/ui/card";
import { SellerQrCode } from "@/components/catalog/seller-qr-code";
import { ShareButton } from "@/components/catalog/share-button";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { SellerTabs } from "@/components/seller/SellerTabs";
import { SellerCardBody } from "@/components/seller/SellerCardBody";
import CatalogoInativo from "@/components/catalog/CatalogoInativo";

const SUPABASE_CATALOG_URL =
  "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/catalog-pages";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ categoria?: string }>;
}): Promise<Metadata> {
  const [{ slug }, { categoria }] = await Promise.all([params, searchParams]);

  const profile = await db.sellerProfile.findFirst({
    where: { slug },
    select: { name: true, slug: true, photo_url: true },
  });

  const metadataMap: Record<string, { title: string; description: string }> = {
    "Perfumes Bortoletto 15ml": {
      title: `Perfumaria Fina 15ml | ${profile?.name ?? "Atlântica Natural"}`,
      description: "Perfumes finos importados em 15ml. Qualidade premium com preço acessível. Confira!",
    },
    "Perfumes Bortoletto 100ml": {
      title: `Perfumaria Fina 100ml | ${profile?.name ?? "Atlântica Natural"}`,
      description: "Perfumes finos em frasco 100ml. Presente perfeito com qualidade de boutique!",
    },
    "Linha Ozonizada": {
      title: `Linha Natuoz Ozonizada | ${profile?.name ?? "Atlântica Natural"}`,
      description: "Óleos ozonizados para pele, cabelo e saúde. Tecnologia natural com resultados comprovados!",
    },
    "Suplementos e Nutracêuticos": {
      title: `Suplementos Naturais | ${profile?.name ?? "Atlântica Natural"}`,
      description: "Vitaminas, suplementos e nutracêuticos de alta qualidade para sua saúde e bem-estar!",
    },
    "ATL Services": {
      title: `ATL Services | ${profile?.name ?? "Atlântica Natural"}`,
      description: "Assistência médica, telefonia, energia e muito mais. Serviços digitais com comissão recorrente!",
    },
  };

  const meta = metadataMap[categoria ?? ""] ?? {
    title: `Catálogo Atlântica Natural | ${profile?.name ?? "Atlântica Natural"}`,
    description: "Mais de 300 produtos naturais com até 100% de lucro na revenda. Acesse o catálogo completo!",
  };

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: [{
        url: profile?.photo_url ?? "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-branco.png",
        width: 1200,
        height: 630,
      }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function SellerPublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ categoria?: string }>;
}) {
  const [{ slug }, { categoria }] = await Promise.all([params, searchParams]);

  const company = await getCompanyFromHost();
  if (!company) {
    notFound();
  }

  const seller = await db.sellerProfile.findUnique({
    where: { company_id_slug: { company_id: company.id, slug } },
    select: {
      id: true, user_id: true, status: true,
      name: true, slug: true, photo_url: true, whatsapp: true,
      instagram: true, youtube: true, tiktok: true, facebook: true,
      other_link: true, other_link_label: true,
      city: true, state: true, bio: true,
      signup_button_text: true, signup_button_url: true, active: true,
    },
  });
  if (!seller) {
    notFound();
  }

  const now = new Date();
  const [activeSubscription, session] = await Promise.all([
    db.subscription.findFirst({
      where: {
        seller_id: seller.id,
        status: "ACTIVE",
        expires_at: { gt: now },
      },
    }),
    auth(),
  ]);

  const isOwner = session?.user?.id === seller.user_id;
  const isSuspended = seller.status === "SUSPENDED";
  const hasNoSubscription = !activeSubscription;

  if (isSuspended || hasNoSubscription) {
    return (
      <CatalogoInativo
        vendedorNome={seller.name}
        vendedorWhatsapp={seller.whatsapp}
        isOwner={isOwner}
      />
    );
  }

  const products = await db.product.findMany({
    where: { company_id: company.id, active: true },
    include: { category: true },
    orderBy: [{ category: { sort_order: "asc" } }, { sort_order: "asc" }],
  });

  const catalogProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price_client: product.price_client !== null ? Number(product.price_client) : null,
    image_url: product.catalog_image_url ?? product.image_url,
    catalogPageUrl: product.catalog_page_file
      ? `${SUPABASE_CATALOG_URL}/${product.catalog_page_file}`
      : product.catalog_page
        ? `${SUPABASE_CATALOG_URL}/${product.catalog_page}.jpg`
        : null,
    category: product.category
      ? { id: product.category.id, name: product.category.name }
      : null,
  }));

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const protocol = host.startsWith("localhost") || host.includes(".localhost")
    ? "http"
    : "https";
  const currentUrl = `${protocol}://${host}/${slug}`;

  const whatsappDigits = seller.whatsapp?.replace(/\D/g, "");

  const cartaoVirtual = <SellerCardBody seller={seller} pageUrl={currentUrl} />;

  const compartilhar = (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center gap-6 pt-6">
        <ShareButton url={currentUrl} title={seller.name} />
        <div className="flex flex-col items-center gap-2 border-t pt-6">
          <SellerQrCode value={currentUrl} />
          <p className="text-center text-xs text-muted-foreground">
            Aponte a câmera para acessar esta página
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const vitrine = (
    <CatalogSection
      products={catalogProducts}
      whatsappPhone={whatsappDigits ?? ""}
      signupButtonText={seller.signup_button_text ?? "Fazer cadastro"}
      signupButtonUrl={seller.signup_button_url ?? "https://cadastro.atlanticanatural.com.br/codigos"}
      sellerName={seller.name}
      pageUrl={currentUrl}
      initialCategoryName={categoria}
    />
  );

  return (
    <SellerTabs
      sellerName={seller.name}
      sellerPhotoUrl={seller.photo_url}
      companyName={company.name}
      vitrine={vitrine}
      cartaoVirtual={cartaoVirtual}
      compartilhar={compartilhar}
    />
  );
}
