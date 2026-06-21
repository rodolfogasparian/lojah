import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCompanyFromHost } from "@/lib/tenant";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SellerQrCode } from "@/components/catalog/seller-qr-code";
import { ShareButton } from "@/components/catalog/share-button";
import { SellerTabs } from "@/components/seller/SellerTabs";
import { SellerCardBody } from "@/components/seller/SellerCardBody";

export default async function CartaoVirtualPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompanyFromHost();
  if (!company) notFound();

  const seller = await db.sellerProfile.findUnique({
    where: { company_id_slug: { company_id: company.id, slug } },
    select: {
      name: true, slug: true, photo_url: true,
      whatsapp: true, instagram: true, youtube: true,
      tiktok: true, facebook: true, other_link: true,
      other_link_label: true, city: true, state: true,
      bio: true, active: true,
      signup_button_text: true, signup_button_url: true,
    },
  });

  if (!seller || !seller.active) notFound();

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const protocol = host.startsWith("localhost") || host.includes(".localhost") ? "http" : "https";
  const pageUrl = `${protocol}://${host}/${slug}/cartao`;

  const cartaoVirtual = <SellerCardBody seller={seller} pageUrl={pageUrl} />;

  const vitrine = (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Veja todos os produtos no catálogo completo.
        </p>
        <Link href={`/${slug}`} className={buttonVariants()}>
          Ver catálogo completo
        </Link>
      </CardContent>
    </Card>
  );

  const compartilhar = (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center gap-6 pt-6">
        <ShareButton url={pageUrl} title={seller.name} />
        <div className="flex flex-col items-center gap-2 border-t pt-6">
          <SellerQrCode value={pageUrl} />
          <p className="text-center text-xs text-muted-foreground">
            Aponte a câmera para acessar esta página
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SellerTabs
      sellerName={seller.name}
      sellerPhotoUrl={seller.photo_url}
      companyName={company.name}
      defaultTab="cartao"
      vitrine={vitrine}
      cartaoVirtual={cartaoVirtual}
      compartilhar={compartilhar}
    />
  );
}
