"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Users, Ticket, LayoutDashboard, Tag, HelpCircle, BookOpen } from "lucide-react";

type Props = {
  adminEmail: string;
  companyName: string;
  logoutButton: ReactNode;
  userRole: "SUPERADMIN" | "COMPANY_ADMIN";
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/vendedores", label: "Vendedores", icon: Users, exact: false },
  { href: "/admin/cupons", label: "Cupons", icon: Tag, exact: false },
  { href: "/admin/suporte", label: "Suporte", icon: Ticket, exact: false },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, exact: false },
  { href: "/admin/materiais", label: "Materiais", icon: BookOpen, exact: false },
];

export function AdminNav({ adminEmail, companyName, logoutButton, userRole }: Props) {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">{companyName}</span>
            <span className="text-[10px] text-muted-foreground">Painel Administrativo</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">{adminEmail}</span>
          <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
            userRole === "SUPERADMIN"
              ? "bg-purple-100 text-purple-700"
              : "bg-green-100 text-green-700"
          }`}>
            {userRole === "SUPERADMIN" ? "Super Admin" : "Admin"}
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
