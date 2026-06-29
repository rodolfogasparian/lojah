import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCompanyFromHost } from "@/lib/tenant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CatalogSection } from "@/components/catalog/CatalogSection";

const FALLBACK_IMAGE = "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-branco.png";
const DESCRIPTION = "Compre com 50% de desconto mais de 300 produtos Atlântica Natural!";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await db.sellerProfile.findFirst({
    where: { slug },
    select: { name: true, slug: true, photo_url: true },
  });

  const name = profile?.name ?? "Consultor(a)";
  const title = `Catálogo Consultor(a) | ${name}`;

  return {
    title,
    description: DESCRIPTION,
    openGraph: {
      title,
      description: DESCRIPTION,
      images: [{ url: profile?.photo_url ?? FALLBACK_IMAGE, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

const SUPABASE_CATALOG_URL =
  "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/catalog-pages";

export default async function ConsultorCatalogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await getCompanyFromHost();
  if (!company) {
    notFound();
  }

  const seller = await db.sellerProfile.findUnique({
    where: { company_id_slug: { company_id: company.id, slug } },
  });
  if (!seller || !seller.active) {
    notFound();
  }

  const products = await db.product.findMany({
    where: { company_id: company.id, active: true },
    include: { category: true },
    orderBy: { sort_order: "asc" },
  });

  const catalogProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price_client: product.price_client !== null ? Number(product.price_client) * 0.5 : null,
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
  const currentUrl = `${protocol}://${host}/${slug}/c`;

  const whatsappDigits = seller.whatsapp?.replace(/\D/g, "");

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <Avatar className="size-12">
            <AvatarImage src={seller.photo_url ?? undefined} alt={seller.name} />
            <AvatarFallback>{seller.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Catálogo Consultor</p>
            <p className="truncate text-xs text-muted-foreground">{seller.name}</p>
          </div>
        </div>
      </header>

      <div className="w-full max-w-3xl flex-1 px-4 py-6">
        <CatalogSection
          products={catalogProducts}
          whatsappPhone={whatsappDigits ?? ""}
          signupButtonText={seller.signup_button_text ?? "Fazer cadastro"}
          signupButtonUrl={seller.signup_button_url ?? "https://cadastro.atlanticanatural.com.br/codigos"}
          sellerName={seller.name}
          pageUrl={currentUrl}
          isConsultor
        />
      </div>
    </div>
  );
}
