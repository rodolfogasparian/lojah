"use client";

import { X, MessageCircle, ExternalLink, ChevronDown } from "lucide-react";
import { LeadKanban } from "@prisma/client";

// ── Tipo compartilhado ────────────────────────────────────────────────────────

export type LeadRow = {
  id: string;
  codigo: string;
  nome: string;
  whatsapp: string;
  perfil_resultante: string;
  caminho: string;
  modalidade: string;
  kanban: LeadKanban;
  created_at: string;
  dor_principal: string | null;
  desejo_dominante: string | null;
  medo_principal: string | null;
  objecao_provavel: string | null;
  prova_necessaria: string | null;
  pitch_sugerido: string | null;
  material_indicado: string | null;
  evitar: string | null;
};

// ── Constantes ────────────────────────────────────────────────────────────────

export const PERFIL_LABELS: Record<string, string> = {
  consumidor_curioso:    "Consumidor Curioso",
  renda_extra_inicial:   "Renda Extra Inicial",
  vendedor_em_evolucao:  "Vendedor(a) em Evolução",
  construtor_equipe:     "Construtor(a) de Equipe",
  empreendedor_servicos: "Empreendedor(a) de Serviços",
  perfil_premium:        "Perfil Premium",
};

export const PERFIL_COLORS: Record<string, string> = {
  consumidor_curioso:    "bg-gray-100 text-gray-700",
  renda_extra_inicial:   "bg-blue-100 text-blue-700",
  vendedor_em_evolucao:  "bg-indigo-100 text-indigo-700",
  construtor_equipe:     "bg-emerald-100 text-emerald-700",
  empreendedor_servicos: "bg-teal-100 text-teal-700",
  perfil_premium:        "bg-amber-100 text-amber-700",
};

export const CAMINHO_LABELS: Record<string, string> = {
  produto:         "Produtos",
  servico:         "Serviços",
  ambos:           "Produtos e Serviços",
  apenas_consumir: "Só Consumir",
  indeciso:        "Indefinido",
};

export const MODALIDADE_LABELS: Record<string, string> = {
  digital:    "Digital",
  presencial: "Presencial",
  misto:      "Misto",
};

export const COLUMNS: { key: LeadKanban; label: string; dot: string; color: string }[] = [
  { key: "novo_contato",          label: "Novo Contato",     dot: "bg-gray-400",   color: "bg-gray-50 border-gray-200" },
  { key: "diagnostico_interesse", label: "Diagnóstico",      dot: "bg-blue-400",   color: "bg-blue-50 border-blue-200" },
  { key: "qualificado",           label: "Qualificado",      dot: "bg-indigo-500", color: "bg-indigo-50 border-indigo-200" },
  { key: "oferta_decisao",        label: "Oferta / Decisão", dot: "bg-purple-500", color: "bg-purple-50 border-purple-200" },
  { key: "agendamento",           label: "Agendamento",      dot: "bg-yellow-400", color: "bg-yellow-50 border-yellow-200" },
  { key: "compra_fechamento",     label: "Fechamento",       dot: "bg-orange-500", color: "bg-orange-50 border-orange-200" },
  { key: "cliente_ativo",         label: "Cliente Ativo",    dot: "bg-green-500",  color: "bg-green-50 border-green-200" },
  { key: "suporte",               label: "Suporte",          dot: "bg-red-400",    color: "bg-red-50 border-red-200" },
  { key: "resolvido_arquivado",   label: "Arquivado",        dot: "bg-gray-300",   color: "bg-gray-50 border-gray-300" },
];

// ── Campos do Lead Card com metadados de cor ──────────────────────────────────

const LEAD_FIELDS: { label: string; key: keyof LeadRow; labelColor: string }[] = [
  { label: "Dor principal",     key: "dor_principal",    labelColor: "text-rose-600" },
  { label: "Desejo dominante",  key: "desejo_dominante", labelColor: "text-violet-600" },
  { label: "Maior medo",        key: "medo_principal",   labelColor: "text-orange-600" },
  { label: "Objeção provável",  key: "objecao_provavel", labelColor: "text-amber-600" },
  { label: "Prova necessária",  key: "prova_necessaria", labelColor: "text-sky-600" },
  { label: "Pitch sugerido",    key: "pitch_sugerido",   labelColor: "text-emerald-600" },
  { label: "Material indicado", key: "material_indicado",labelColor: "text-teal-600" },
  { label: "Evitar",            key: "evitar",           labelColor: "text-red-500" },
];

// ── Componente ────────────────────────────────────────────────────────────────

type Props = {
  lead: LeadRow;
  currentKanban: LeadKanban;
  waLink: string;
  resultUrl: string;
  isPending: boolean;
  onMover: (col: LeadKanban) => void;
  onClose: () => void;
};

export function LeadModal({
  lead,
  currentKanban,
  waLink,
  resultUrl,
  isPending,
  onMover,
  onClose,
}: Props) {
  const perfilColor = PERFIL_COLORS[lead.perfil_resultante] ?? "bg-gray-100 text-gray-600";
  const activeFields = LEAD_FIELDS.filter((f) => lead[f.key]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog centralizado */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">

        {/* Header sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-start justify-between gap-3 z-10 rounded-t-2xl">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-base truncate">{lead.nome}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] font-mono text-gray-400">{lead.codigo}</span>
              {/* Badge de funil — fixo enquanto só existe um funil */}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                Renda Inteligente
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 size-8 rounded-lg border border-gray-200 grid place-items-center text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 p-5 flex flex-col gap-5">

          {/* Badges: perfil / caminho / modalidade */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${perfilColor}`}>
              {PERFIL_LABELS[lead.perfil_resultante] ?? lead.perfil_resultante}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {CAMINHO_LABELS[lead.caminho] ?? lead.caminho}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {MODALIDADE_LABELS[lead.modalidade] ?? lead.modalidade}
            </span>
          </div>

          {/* Mover de etapa */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
              Etapa do funil{isPending && <span className="text-blue-400 font-normal"> (salvando…)</span>}
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
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="size-4" /> Enviar mensagem
            </a>
            <a
              href={resultUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="size-4" /> Diagnóstico
            </a>
          </div>

          {/* Lead Card — campos com hierarquia de cor */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Lead Card
            </p>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              {activeFields.length === 0 ? (
                <p className="px-4 py-5 text-sm text-gray-400 text-center">
                  Sem informações de diagnóstico disponíveis.
                </p>
              ) : (
                activeFields.map((f, i) => (
                  <div
                    key={f.key}
                    className={`px-4 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${f.labelColor}`}>
                      {f.label}
                    </p>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {lead[f.key] as string}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Rodapé */}
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
