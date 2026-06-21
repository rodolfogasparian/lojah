import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCompanyFromHost } from "@/lib/tenant";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, MessageCircle, ExternalLink } from "lucide-react";
import { SellerQrCode } from "@/components/catalog/seller-qr-code";

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
  const whatsappDigits = seller.whatsapp?.replace(/\D/g, "");
  const instagramHandle = seller.instagram?.replace(/^@/, "");
  const location = [seller.city, seller.state].filter(Boolean).join(", ");

  function extractHandle(url: string): string {
    try {
      const path = new URL(url).pathname;
      const parts = path.split("/").filter(Boolean);
      const last = parts[parts.length - 1] ?? "";
      return last.startsWith("@") ? last : `@${last}`;
    } catch {
      return url;
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">

        {/* Foto + Nome */}
        <div className="flex flex-col items-center gap-3">
          <div className="size-24 rounded-full overflow-hidden border-4 border-primary/20 bg-secondary flex items-center justify-center">
            {seller.photo_url ? (
              <img src={seller.photo_url} alt={seller.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {seller.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">{seller.name}</h1>
            <p className="text-sm text-muted-foreground">Consultora {company.name}</p>
          </div>
          {location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {location}
            </div>
          )}
          {seller.bio && (
            <p className="text-sm text-center text-muted-foreground leading-relaxed">
              {seller.bio}
            </p>
          )}
        </div>

        {/* Botões de contato e redes sociais */}
        <div className="w-full flex flex-col gap-2">
          {whatsappDigits && (
            <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer"
              className={cn(buttonVariants(), "h-11 bg-[#25D366] text-white hover:bg-[#1ebe57] w-full")}>
              <MessageCircle className="size-4" /> Falar no WhatsApp
            </a>
          )}
          {instagramHandle && (
            <a href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer"
              className="h-11 w-full rounded-lg bg-gray-100 text-[#2d6a4f] border border-gray-200 flex items-center gap-3 px-4 hover:bg-gray-200 transition-colors">
              <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="text-sm font-medium">@{instagramHandle}</span>
            </a>
          )}
          {seller.youtube && (
            <a href={seller.youtube} target="_blank" rel="noopener noreferrer"
              className="h-11 w-full rounded-lg bg-gray-100 text-[#2d6a4f] border border-gray-200 flex items-center gap-3 px-4 hover:bg-gray-200 transition-colors">
              <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
              </svg>
              <span className="text-sm font-medium">{extractHandle(seller.youtube)}</span>
            </a>
          )}
          {seller.tiktok && (
            <a href={seller.tiktok} target="_blank" rel="noopener noreferrer"
              className="h-11 w-full rounded-lg bg-gray-100 text-[#2d6a4f] border border-gray-200 flex items-center gap-3 px-4 hover:bg-gray-200 transition-colors">
              <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/>
              </svg>
              <span className="text-sm font-medium">{extractHandle(seller.tiktok)}</span>
            </a>
          )}
          {seller.facebook && (
            <a href={seller.facebook} target="_blank" rel="noopener noreferrer"
              className="h-11 w-full rounded-lg bg-gray-100 text-[#2d6a4f] border border-gray-200 flex items-center gap-3 px-4 hover:bg-gray-200 transition-colors">
              <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              <span className="text-sm font-medium">{extractHandle(seller.facebook)}</span>
            </a>
          )}
          {seller.other_link && (
            <a href={seller.other_link} target="_blank" rel="noopener noreferrer"
              className="h-11 w-full rounded-lg bg-gray-100 text-[#2d6a4f] border border-gray-200 flex items-center gap-3 px-4 hover:bg-gray-200 transition-colors">
              <ExternalLink className="size-5 shrink-0" />
              <span className="text-sm font-medium">{seller.other_link_label || extractHandle(seller.other_link)}</span>
            </a>
          )}

          {/* Botão do catálogo */}
          {seller.signup_button_url && (
            <a href={seller.signup_button_url} target="_blank" rel="noopener noreferrer"
              className={cn(buttonVariants(), "h-11 w-full mt-2")}>
              {seller.signup_button_text || "Fazer cadastro"}
            </a>
          )}
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-2 border-t pt-6 w-full">
          <SellerQrCode value={pageUrl} />
          <p className="text-xs text-muted-foreground text-center">
            Aponte a câmera para acessar este cartão
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Cartão digital por lojah.app
        </p>
      </div>
    </div>
  );
}
