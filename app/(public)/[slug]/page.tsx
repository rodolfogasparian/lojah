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

const SUPABASE_STORAGE_URL =
  "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public";

const DEFAULT_IMAGE = `${SUPABASE_STORAGE_URL}/products/logo-atlantica-fundo-preto.jpg`;
const DEFAULT_BIO = "Sou Consultor da Atlântica Natural e estou aqui para te ajudar!";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompanyFromHost();
  if (!company) return {};

  const seller = await db.sellerProfile.findUnique({
    where: { company_id_slug: { company_id: company.id, slug } },
    select: { name: true, bio: true, photo_url: true },
  });
  if (!seller) return {};

  const title = `Catálogo Atlântica Natural | ${seller.name}`;
  const description = seller.bio?.trim() || DEFAULT_BIO;
  const image = seller.photo_url || DEFAULT_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 800, height: 800, alt: seller.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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
