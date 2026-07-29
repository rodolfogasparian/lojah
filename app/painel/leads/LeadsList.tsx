"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  LeadModal,
  LeadRow,
  COLUMNS,
  PERFIL_LABELS,
  PERFIL_COLORS,
  CAMINHO_LABELS,
} from "./LeadModal";

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Props = {
  leads: LeadRow[];
  templates: Record<string, string>;
  companySlug: string;
  sellerSlug: string;
};

// ── LeadsList ─────────────────────────────────────────────────────────────────

export function LeadsList({ leads, templates, companySlug, sellerSlug }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedLead = leads.find((l) => l.id === selectedId) ?? null;

  function buildWaLink(lead: LeadRow) {
    const template = templates[lead.kanban] ?? "Oi [NOME]!";
    const msg = template
      .replace(/\[NOME\]/g, lead.nome)
      .replace(/\[PERFIL\]/g, PERFIL_LABELS[lead.perfil_resultante] ?? lead.perfil_resultante)
      .replace(/\[CAMINHO\]/g, CAMINHO_LABELS[lead.caminho] ?? lead.caminho)
      .replace(/\[LINK_RESULTADO\]/g, `https://${companySlug}.lojah.app/${sellerSlug}/plano/resultado/${lead.codigo}`)
      .replace(/\[LINK_CHECKOUT\]/g, `https://${companySlug}.lojah.app/${sellerSlug}/plano/resultado/${lead.codigo}`);
    const phone = lead.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  function buildResultUrl(lead: LeadRow) {
    return `https://${companySlug}.lojah.app/${sellerSlug}/plano/resultado/${lead.codigo}`;
  }

  const getColumnLabel = (key: string) =>
    COLUMNS.find((c) => c.key === key)?.label ?? key;

  if (leads.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm">
        Nenhum lead ainda.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {leads.map((lead) => {
          const perfilColor = PERFIL_COLORS[lead.perfil_resultante] ?? "bg-gray-100 text-gray-600";
          const date = new Date(lead.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "2-digit",
          });

          return (
            <div
              key={lead.id}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelectedId(lead.id)}
            >
              {/* Info principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-800 truncate">{lead.nome}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${perfilColor}`}>
                    {PERFIL_LABELS[lead.perfil_resultante] ?? lead.perfil_resultante}
                  </span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 shrink-0">
                    Renda Inteligente
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-[10px] font-mono text-gray-400">{lead.codigo}</span>
                  <span className="text-[10px] text-gray-500">
                    {getColumnLabel(lead.kanban)}
                  </span>
                  <span className="text-[10px] text-gray-400">{date}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <a
                  href={buildWaLink(lead)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold hover:bg-green-100 transition-colors"
                >
                  <MessageCircle className="size-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedId(lead.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-[10px] font-medium hover:bg-gray-100 transition-colors"
                >
                  Ver
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          currentKanban={selectedLead.kanban}
          waLink={buildWaLink(selectedLead)}
          resultUrl={buildResultUrl(selectedLead)}
          isPending={false}
          onMover={() => {}}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
