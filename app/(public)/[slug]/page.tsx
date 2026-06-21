import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { AtSign, ExternalLink, MapPin, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { getCompanyFromHost } from "@/lib/tenant";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SellerQrCode } from "@/components/catalog/seller-qr-code";
import { ShareButton } from "@/components/catalog/share-button";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { SellerTabs } from "@/components/seller/SellerTabs";
import { cn } from "@/lib/utils";

const SUPABASE_CATALOG_URL =
  "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/catalog-pages";

export default async function SellerPublicPage({
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
    select: {
      name: true, slug: true, photo_url: true, whatsapp: true,
      instagram: true, youtube: true, tiktok: true, facebook: true,
      other_link: true, other_link_label: true,
      city: true, state: true, bio: true,
      signup_button_text: true, signup_button_url: true, active: true,
    },
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
  const instagramHandle = seller.instagram?.replace(/^@/, "");
  const location = [seller.city, seller.state].filter(Boolean).join(", ");

  const cartaoVirtual = (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col gap-6 pt-6">
        {location && (
          <Badge variant="outline" className="w-fit gap-1">
            <MapPin className="size-3" />
            {location}
          </Badge>
        )}

        {seller.bio && (
          <p className="text-sm text-muted-foreground">{seller.bio}</p>
        )}

        {(whatsappDigits ||
          instagramHandle ||
          seller.youtube ||
          seller.tiktok ||
          seller.facebook ||
          seller.other_link) && (
          <div className="flex flex-col gap-2">
            {/* WhatsApp */}
            {whatsappDigits && (
              <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer"
                className={cn(buttonVariants(), "h-10 bg-[#25D366] text-white hover:bg-[#1ebe57]")}>
                <MessageCircle /> Falar no WhatsApp
              </a>
            )}

            {/* Instagram */}
            {instagramHandle && (
              <a href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "h-10")}>
                <AtSign /> {instagramHandle}
              </a>
            )}

            {/* YouTube */}
            {seller.youtube && (
              <a href={seller.youtube} target="_blank" rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "h-10 text-red-600 border-red-200 hover:bg-red-50")}>
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                YouTube
              </a>
            )}

            {/* TikTok */}
            {seller.tiktok && (
              <a href={seller.tiktok} target="_blank" rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "h-10")}>
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/></svg>
                TikTok
              </a>
            )}

            {/* Facebook */}
            {seller.facebook && (
              <a href={seller.facebook} target="_blank" rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "h-10 text-blue-600 border-blue-200 hover:bg-blue-50")}>
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                Facebook
              </a>
            )}

            {/* Link personalizado */}
            {seller.other_link && (
              <a href={seller.other_link} target="_blank" rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "h-10")}>
                <ExternalLink className="size-4" />
                {seller.other_link_label || "Meu link"}
              </a>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-2 border-t pt-6">
          <SellerQrCode value={currentUrl} />
          <p className="text-center text-xs text-muted-foreground">
            Aponte a câmera para acessar esta página
          </p>
        </div>
      </CardContent>
    </Card>
  );

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
