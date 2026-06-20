"use client";

import { useState, type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type TabId = "vitrine" | "cartao" | "compartilhar";

const TABS: { id: TabId; label: string }[] = [
  { id: "vitrine", label: "Vitrine" },
  { id: "cartao", label: "Cartão Virtual" },
  { id: "compartilhar", label: "Compartilhar" },
];

export function SellerTabs({
  sellerName,
  sellerPhotoUrl,
  companyName,
  vitrine,
  cartaoVirtual,
  compartilhar,
}: {
  sellerName: string;
  sellerPhotoUrl: string | null;
  companyName: string;
  vitrine: ReactNode;
  cartaoVirtual: ReactNode;
  compartilhar: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("vitrine");

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-white">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={sellerPhotoUrl ?? undefined} alt={sellerName} />
              <AvatarFallback>{sellerName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{sellerName}</p>
              <p className="truncate text-xs text-muted-foreground">
                Consultor(a) {companyName}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="w-full max-w-3xl flex-1 px-4 py-6">
        {activeTab === "vitrine" && vitrine}
        {activeTab === "cartao" && cartaoVirtual}
        {activeTab === "compartilhar" && compartilhar}
      </div>
    </div>
  );
}
