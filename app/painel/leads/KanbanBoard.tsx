"use client";

import { useState, useTransition, useMemo } from "react";
import { MessageCircle } from "lucide-react";
import { moverLead } from "./actions";
import { LeadKanban } from "@prisma/client";
import {
  LeadModal,
  LeadRow,
  COLUMNS,
  PERFIL_LABELS,
  PERFIL_COLORS,
  CAMINHO_LABELS,
  MODALIDADE_LABELS,
} from "./LeadModal";

// ── Resolução de placeholders ─────────────────────────────────────────────────

function resolveMsg(template: string, lead: LeadRow, companySlug: string, sellerSlug: string): string {
  const resultUrl = `https://${companySlug}.lojah.app/${sellerSlug}/plano/resultado/${lead.codigo}`;
  return template
    .replace(/\[NOME\]/g, lead.nome)
    .replace(/\[PERFIL\]/g, PERFIL_LABELS[lead.perfil_resultante] ?? lead.perfil_resultante)
    .replace(/\[CAMINHO\]/g, CAMINHO_LABELS[lead.caminho] ?? lead.caminho)
    .replace(/\[MODALIDADE\]/g, MODALIDADE_LABELS[lead.modalidade] ?? lead.modalidade)
    .replace(/\[LINK_RESULTADO\]/g, resultUrl)
    .replace(/\[LINK_CHECKOUT\]/g, resultUrl);
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Props = {
  leads: LeadRow[];
  templates: Record<string, string>;
  companySlug: string;
  sellerSlug: string;
};

// ── KanbanBoard ───────────────────────────────────────────────────────────────

export function KanbanBoard({ leads, templates, companySlug, sellerSlug }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [optimistic, setOptimistic] = useState<Record<string, LeadKanban>>({});
  const [isPending, startTransition] = useTransition();

  const selectedLead = leads.find((l) => l.id === selectedId) ?? null;

  const grouped = useMemo(() => {
    const map = new Map<LeadKanban, LeadRow[]>();
    for (const col of COLUMNS) map.set(col.key, []);
    for (const lead of leads) {
      const col = optimistic[lead.id] ?? lead.kanban;
      map.get(col)?.push(lead);
    }
    return map;
  }, [leads, optimistic]);

  function handleMover(leadId: string, novaColuna: LeadKanban) {
    setOptimistic((prev) => ({ ...prev, [leadId]: novaColuna }));
    startTransition(async () => {
      try {
        await moverLead(leadId, novaColuna);
      } catch {
        setOptimistic((prev) => {
          const next = { ...prev };
          delete next[leadId];
          return next;
        });
      }
    });
  }

  function buildWaLink(lead: LeadRow) {
    const kanbanAtual = optimistic[lead.id] ?? lead.kanban;
    const template = templates[kanbanAtual] ?? "Oi [NOME]!";
    const msg = resolveMsg(template, lead, companySlug, sellerSlug);
    const phone = lead.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  function buildResultUrl(lead: LeadRow) {
    return `https://${companySlug}.lojah.app/${sellerSlug}/plano/resultado/${lead.codigo}`;
  }

  return (
    <>
      {/* Board — full-bleed horizontal scroll */}
      <div
        className="overflow-x-auto pb-4"
        style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
      >
        <div className="flex gap-3 px-4" style={{ minWidth: "max-content" }}>
          {COLUMNS.map((col) => {
            const colLeads = grouped.get(col.key) ?? [];
            return (
              <div
                key={col.key}
                className={`w-[240px] shrink-0 rounded-xl border ${col.color} flex flex-col`}
              >
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-inherit">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${col.dot}`} />
                  <span className="text-xs font-bold text-gray-700 leading-tight flex-1">{col.label}</span>
                  <span className="text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded-full px-1.5 py-0.5">
                    {colLeads.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2 p-2 min-h-[120px]">
                  {colLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      waLink={buildWaLink(lead)}
                      onOpen={() => setSelectedId(lead.id)}
                    />
                  ))}
                  {colLeads.length === 0 && (
                    <p className="text-[10px] text-gray-400 text-center py-4">Vazio</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          currentKanban={optimistic[selectedLead.id] ?? selectedLead.kanban}
          waLink={buildWaLink(selectedLead)}
          resultUrl={buildResultUrl(selectedLead)}
          isPending={isPending}
          onMover={(col) => handleMover(selectedLead.id, col)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}

// ── Card do lead ──────────────────────────────────────────────────────────────

function LeadCard({
  lead,
  waLink,
  onOpen,
}: {
  lead: LeadRow;
  waLink: string;
  onOpen: () => void;
}) {
  const date = new Date(lead.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const perfilColor = PERFIL_COLORS[lead.perfil_resultante] ?? "bg-gray-100 text-gray-600";

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1">{lead.nome}</p>
        <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{date}</span>
      </div>
      <p className="text-[10px] font-mono text-gray-400 mb-2">{lead.codigo}</p>

      {/* Badges: perfil + funil */}
      <div className="flex flex-wrap gap-1 mb-2">
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${perfilColor}`}>
          {PERFIL_LABELS[lead.perfil_resultante] ?? lead.perfil_resultante}
        </span>
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
          Renda Inteligente
        </span>
      </div>

      {lead.dor_principal && (
        <p className="text-[10px] text-gray-500 line-clamp-2 leading-snug mb-2">
          {lead.dor_principal}
        </p>
      )}

      <div className="flex gap-1 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold hover:bg-green-100 transition-colors"
        >
          <MessageCircle className="size-3" /> WhatsApp
        </a>
        <button
          type="button"
          onClick={onOpen}
          className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-500 text-[10px] font-medium hover:bg-gray-100 transition-colors"
        >
          Ver
        </button>
      </div>
    </div>
  );
}
