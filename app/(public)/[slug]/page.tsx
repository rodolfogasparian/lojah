import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { AtSign, MapPin, MessageCircle } from "lucide-react";
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

        {(whatsappDigits || instagramHandle) && (
          <div className="flex flex-col gap-2">
            {whatsappDigits && (
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants(),
                  "h-10 bg-[#25D366] text-white hover:bg-[#1ebe57]"
                )}
              >
                <MessageCircle /> Falar no WhatsApp
              </a>
            )}
            {instagramHandle && (
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "h-10")}
              >
                <AtSign /> {instagramHandle}
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
