"use client";

import { useState, useTransition, useMemo } from "react";
import { X, MessageCircle, ExternalLink, ChevronDown } from "lucide-react";
import { moverLead } from "./actions";
import { LeadKanban } from "@prisma/client";

// ── Constantes ────────────────────────────────────────────────────────────────

const COLUMNS: { key: LeadKanban; label: string; color: string; dot: string }[] = [
  { key: "novo_contato",          label: "Novo Contato",          color: "bg-gray-50 border-gray-200",    dot: "bg-gray-400" },
  { key: "diagnostico_interesse", label: "Diagnóstico",           color: "bg-blue-50 border-blue-200",    dot: "bg-blue-400" },
  { key: "qualificado",           label: "Qualificado",           color: "bg-indigo-50 border-indigo-200",dot: "bg-indigo-500" },
  { key: "oferta_decisao",        label: "Oferta / Decisão",      color: "bg-purple-50 border-purple-200",dot: "bg-purple-500" },
  { key: "agendamento",           label: "Agendamento",           color: "bg-yellow-50 border-yellow-200",dot: "bg-yellow-400" },
  { key: "compra_fechamento",     label: "Fechamento",            color: "bg-orange-50 border-orange-200",dot: "bg-orange-500" },
  { key: "cliente_ativo",         label: "Cliente Ativo",         color: "bg-green-50 border-green-200",  dot: "bg-green-500" },
  { key: "suporte",               label: "Suporte",               color: "bg-red-50 border-red-200",      dot: "bg-red-400" },
  { key: "resolvido_arquivado",   label: "Arquivado",             color: "bg-gray-50 border-gray-300",    dot: "bg-gray-300" },
];

const PERFIL_LABELS: Record<string, string> = {
  iniciante_urgente:    "Iniciante c/ Urgência",
  sonhador_cauteloso:   "Sonhador(a) Cauteloso(a)",
  investidor_pronto:    "Investidor(a) Pronto(a)",
  vendedor_em_evolucao: "Vendedor(a) em Evolução",
  tempo_limitado:       "Tempo Limitado",
};

const PERFIL_COLORS: Record<string, string> = {
  iniciante_urgente:    "bg-red-100 text-red-700",
  sonhador_cauteloso:   "bg-blue-100 text-blue-700",
  investidor_pronto:    "bg-emerald-100 text-emerald-700",
  vendedor_em_evolucao: "bg-indigo-100 text-indigo-700",
  tempo_limitado:       "bg-amber-100 text-amber-700",
};

const CAMINHO_LABELS: Record<string, string> = {
  produto:  "Produtos",
  servico:  "Serviços",
  ambos:    "Produtos e Serviços",
  indeciso: "Indefinido",
};

const MODALIDADE_LABELS: Record<string, string> = {
  digital:    "Digital",
  presencial: "Presencial",
  misto:      "Misto",
};

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type LeadRow = {
  id: string;
  codigo: string;
  nome: string;
  whatsapp: string;
  perfil_resultante: string;
  caminho: string;
  modalidade: string;
  kanban: LeadKanban;
  created_at: string; // ISO string — Date não é serializável para client
  dor_principal: string | null;
  desejo_dominante: string | null;
  medo_principal: string | null;
  objecao_provavel: string | null;
  prova_necessaria: string | null;
  pitch_sugerido: string | null;
  material_indicado: string | null;
  evitar: string | null;
};

type Props = {
  leads: LeadRow[];
  templates: Record<string, string>; // kanban → mensagem com placeholders
  companySlug: string;
  sellerSlug: string;
};

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

// ── Componente principal ──────────────────────────────────────────────────────

export function KanbanLeads({ leads, templates, companySlug, sellerSlug }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [optimistic, setOptimistic] = useState<Record<string, LeadKanban>>({});
  const [isPending, startTransition] = useTransition();

  const selectedLead = leads.find((l) => l.id === selectedId) ?? null;

  // Agrupa leads por coluna, usando estado otimista para movimentos pendentes
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
        // Reverte otimismo se falhar
        setOptimistic((prev) => {
          const next = { ...prev };
          delete next[leadId];
          return next;
        });
      }
    });
  }

  function waLink(lead: LeadRow) {
    const kanbanAtual = optimistic[lead.id] ?? lead.kanban;
    const template = templates[kanbanAtual] ?? "Oi [NOME]!";
    const msg = resolveMsg(template, lead, companySlug, sellerSlug);
    const phone = lead.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  const resultUrl = (lead: LeadRow) =>
    `https://${companySlug}.lojah.app/${sellerSlug}/plano/resultado/${lead.codigo}`;

  // ── Board ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Kanban board — full-bleed horizontal scroll */}
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
                {/* Cabeçalho da coluna */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-inherit">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${col.dot}`} />
                  <span className="text-xs font-bold text-gray-700 leading-tight flex-1">{col.label}</span>
                  <span className="text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded-full px-1.5 py-0.5">
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 p-2 min-h-[120px]">
                  {colLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      waLink={waLink(lead)}
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

      {/* Modal lateral */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          currentKanban={optimistic[selectedLead.id] ?? selectedLead.kanban}
          waLink={waLink(selectedLead)}
          resultUrl={resultUrl(selectedLead)}
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
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-1 mb-2">
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1">{lead.nome}</p>
        <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{date}</span>
      </div>
      <p className="text-[10px] font-mono text-gray-400 mb-2">{lead.codigo}</p>
      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mb-2 ${perfilColor}`}>
        {PERFIL_LABELS[lead.perfil_resultante] ?? lead.perfil_resultante}
      </span>
      {lead.dor_principal && (
        <p className="text-[10px] text-gray-500 line-clamp-2 leading-snug">{lead.dor_principal}</p>
      )}
      <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
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

// ── Modal lateral ─────────────────────────────────────────────────────────────

function LeadModal({
  lead,
  currentKanban,
  waLink,
  resultUrl,
  isPending,
  onMover,
  onClose,
}: {
  lead: LeadRow;
  currentKanban: LeadKanban;
  waLink: string;
  resultUrl: string;
  isPending: boolean;
  onMover: (col: LeadKanban) => void;
  onClose: () => void;
}) {
  const perfilColor = PERFIL_COLORS[lead.perfil_resultante] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Painel */}
      <div className="relative w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-3 z-10">
          <div className="min-w-0">
            <p className="font-bold text-gray-800 truncate">{lead.nome}</p>
            <p className="text-[10px] font-mono text-gray-400">{lead.codigo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 size-8 rounded-lg border border-gray-200 grid place-items-center text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-5">
          {/* Perfil + badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${perfilColor}`}>
              {PERFIL_LABELS[lead.perfil_resultante] ?? lead.perfil_resultante}
            </span>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {CAMINHO_LABELS[lead.caminho] ?? lead.caminho}
            </span>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {MODALIDADE_LABELS[lead.modalidade] ?? lead.modalidade}
            </span>
          </div>

          {/* Mover de coluna */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
              Coluna atual {isPending && <span className="text-blue-400">(salvando…)</span>}
            </label>
            <div className="relative">
              <select
                value={currentKanban}
                disabled={isPending}
                onChange={(e) => onMover(e.target.value as LeadKanban)}
                className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 pr-8"
              >
                {COLUMNS.map((col) => (
                  <option key={col.key} value={col.key}>{col.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="size-3.5" /> Enviar mensagem
            </a>
            <a
              href={resultUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="size-3.5" /> Resultado
            </a>
          </div>

          {/* Lead Card completo */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Lead Card</p>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {[
                { label: "Dor principal",     value: lead.dor_principal },
                { label: "Desejo dominante",  value: lead.desejo_dominante },
                { label: "Maior medo",        value: lead.medo_principal },
                { label: "Objeção provável",  value: lead.objecao_provavel },
                { label: "Prova necessária",  value: lead.prova_necessaria },
                { label: "Pitch sugerido",    value: lead.pitch_sugerido },
                { label: "Material indicado", value: lead.material_indicado },
                { label: "Evitar",            value: lead.evitar },
              ].filter((row) => row.value).map((row) => (
                <div key={row.label} className="px-4 py-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{row.label}</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data */}
          <p className="text-[10px] text-gray-400 text-center">
            Lead criado em{" "}
            {new Date(lead.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit", month: "2-digit", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
