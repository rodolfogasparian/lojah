import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCompanyFromHost } from "@/lib/tenant";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SellerQrCode } from "@/components/catalog/seller-qr-code";
import { cn } from "@/lib/utils";

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

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const protocol = host.startsWith("localhost") || host.includes(".localhost")
    ? "http"
    : "https";
  const currentUrl = `${protocol}://${host}/${slug}`;

  const whatsappDigits = seller.whatsapp?.replace(/\D/g, "");
  const instagramHandle = seller.instagram?.replace(/^@/, "");
  const location = [seller.city, seller.state].filter(Boolean).join(" - ");

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <Avatar size="lg" className="size-24">
            <AvatarImage src={seller.photo_url ?? undefined} alt={seller.name} />
            <AvatarFallback className="text-2xl">
              {seller.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-xl font-semibold">{seller.name}</h1>
            {location && <Badge variant="outline">{location}</Badge>}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {seller.bio && (
            <p className="text-center text-sm text-muted-foreground">
              {seller.bio}
            </p>
          )}

          {(whatsappDigits || instagramHandle) && (
            <div className="flex flex-col gap-2">
              {whatsappDigits && (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants(), "h-10")}
                >
                  Falar no WhatsApp
                </a>
              )}
              {instagramHandle && (
                <a
                  href={`https://instagram.com/${instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline" }), "h-10")}
                >
                  @{instagramHandle}
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
    </div>
  );
}
