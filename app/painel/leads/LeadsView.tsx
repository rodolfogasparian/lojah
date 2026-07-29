"use client";

import { useState } from "react";
import { LayoutDashboard, List } from "lucide-react";
import type { LeadRow } from "./LeadModal";
import { KanbanBoard } from "./KanbanBoard";
import { LeadsList } from "./LeadsList";

export type { LeadRow };

// ── Tipos ─────────────────────────────────────────────────────────────────────

type View = "kanban" | "lista";

type Props = {
  leads: LeadRow[];
  templates: Record<string, string>;
  companySlug: string;
  sellerSlug: string;
  initialView: View;
};

// ── LeadsView ─────────────────────────────────────────────────────────────────

export function LeadsView({
  leads,
  templates,
  companySlug,
  sellerSlug,
  initialView,
}: Props) {
  const [view, setView] = useState<View>(initialView);

  return (
    <div>
      {/* Toggle Lista / Kanban */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 border border-gray-200">
          <button
            type="button"
            onClick={() => setView("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              view === "kanban"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutDashboard className="size-3.5" /> Kanban
          </button>
          <button
            type="button"
            onClick={() => setView("lista")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              view === "lista"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="size-3.5" /> Lista
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanBoard
          leads={leads}
          templates={templates}
          companySlug={companySlug}
          sellerSlug={sellerSlug}
        />
      ) : (
        <LeadsList
          leads={leads}
          templates={templates}
          companySlug={companySlug}
          sellerSlug={sellerSlug}
        />
      )}
    </div>
  );
}
