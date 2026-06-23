"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { User, CreditCard, Ticket, HeadphonesIcon, HelpCircle, ExternalLink, Link2 } from "lucide-react";

type Props = {
  sellerName: string;
  sellerSlug: string;
  companySlug: string;
  photoUrl: string | null;
  logoutButton: ReactNode;
};

const NAV = [
  { href: "/painel",         label: "Seus Links",      icon: Link2 },
  { href: "/painel/perfil",  label: "Meu Perfil",      icon: User },
  { href: "/painel/cartao",  label: "Cartão Virtual",  icon: CreditCard },
  { href: "/painel/cupons",  label: "Cupons",          icon: Ticket },
  { href: "/painel/suporte", label: "Suporte",         icon: HeadphonesIcon },
  { href: "/painel/faq",     label: "FAQ",             icon: HelpCircle },
];

export function PainelNav({ sellerName, sellerSlug, companySlug, photoUrl, logoutButton }: Props) {
  const pathname = usePathname();
  const catalogUrl = companySlug && sellerSlug
    ? `https://${companySlug}.lojah.app/${sellerSlug}`
    : "#";

  return (
    <header className="bg-card border-b border-border">
      {/* Topo */}
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt={sellerName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-primary">
                {sellerName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{sellerName}</p>
            <p className="text-[10px] text-muted-foreground">Painel do Consultor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={catalogUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-primary font-semibold border border-primary/30 rounded-lg px-2 py-1 hover:bg-primary/5 transition-colors"
          >
            <ExternalLink className="size-3" />
            Ver vitrine
          </a>
          {logoutButton}
        </div>
      </div>

      {/* Menu tabs */}
      <nav className="max-w-2xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              pathname === href
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
