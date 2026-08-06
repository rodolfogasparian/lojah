"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/painel/plano-de-acao/meu", label: "Meu Plano" },
  { href: "/painel/plano-de-acao/orientados", label: "Orientados" },
  { href: "/painel/plano-de-acao/convite", label: "Convite" },
];

export function PlanoDeAcaoNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 border-b border-gray-100 mb-5 -mt-1">
      {TABS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            pathname.startsWith(href)
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
