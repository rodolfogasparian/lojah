"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2 } from "lucide-react";

type Props = {
  adminEmail: string;
  logoutButton: ReactNode;
};

const NAV = [
  { href: "/master", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/master/empresas", label: "Empresas", icon: Building2, exact: false },
];

export function MasterNav({ adminEmail, logoutButton }: Props) {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground">Lojah Master</span>
          <span className="text-[10px] text-muted-foreground">Painel Superadmin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">{adminEmail}</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
            Super Admin
          </span>
          {logoutButton}
        </div>
      </div>

      <nav className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto border-t border-gray-100">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
