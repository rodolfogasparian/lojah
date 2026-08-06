"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Check } from "lucide-react";
import type { ActionItemCategory, ActionItemStatus } from "@prisma/client";
import { saveItem, deleteItem } from "@/app/painel/plano-de-acao/actions";

export type SerializedItem = {
  id: string;
  category: ActionItemCategory;
  action_text: string;
  desired_result: string | null;
  actual_result: string | null;
  status: ActionItemStatus;
  sort_order: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  VENDA: "Venda",
  CONTATO: "Contato",
  APRESENTACAO: "Apresentação",
  ACOMPANHAMENTO: "Acompanhamento",
  POS_VENDA: "Pós-venda",
  TREINAMENTO: "Treinamento",
  ESTUDO: "Estudo",
  POSTAGEM_REDES: "Postagem",
  RECRUTAMENTO: "Recrutamento",
  REUNIAO: "Reunião",
  ORGANIZACAO: "Organização",
  OUTRO: "Outro",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDENTE: { label: "Pendente", color: "text-gray-500" },
  REALIZADO: { label: "Realizado", color: "text-green-600" },
  PARCIAL: { label: "Parcial", color: "text-amber-600" },
  NAO_REALIZADO: { label: "Não realizado", color: "text-red-500" },
};

type RowState = {
  id?: string;
  category: string;
  action_text: string;
  desired_result: string;
  actual_result: string;
  status: string;
  sort_order: number;
  saving: boolean;
  justSaved: boolean;
};

function makeRow(item: SerializedItem): RowState {
  return {
    id: item.id,
    category: item.category,
    action_text: item.action_text,
    desired_result: item.desired_result ?? "",
    actual_result: item.actual_result ?? "",
    status: item.status,
    sort_order: item.sort_order,
    saving: false,
    justSaved: false,
  };
}

function emptyRow(sortOrder: number): RowState {
  return {
    id: undefined,
    category: "OUTRO",
    action_text: "",
    desired_result: "",
    actual_result: "",
    status: "PENDENTE",
    sort_order: sortOrder,
    saving: false,
    justSaved: false,
  };
}

type Props = {
  items: SerializedItem[];
  weekStart: string;
  readOnly?: boolean;
};

export function WeeklyActionTable({ items, weekStart, readOnly = false }: Props) {
  const [rows, setRows] = useState<RowState[]>(() => items.map(makeRow));

  function update(idx: number, patch: Partial<RowState>) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  async function handleSave(idx: number) {
    const row = rows[idx];
    if (!row.action_text.trim()) return;
    update(idx, { saving: true });
    try {
      const result = await saveItem({
        id: row.id,
        weekStart,
        category: row.category as ActionItemCategory,
        action_text: row.action_text.trim(),
        desired_result: row.desired_result.trim() || undefined,
        actual_result: row.actual_result.trim() || undefined,
        status: row.status as ActionItemStatus,
      });
      update(idx, { id: result.id, saving: false, justSaved: true });
      setTimeout(() => update(idx, { justSaved: false }), 2000);
    } catch {
      update(idx, { saving: false });
    }
  }

  async function handleDelete(idx: number) {
    const row = rows[idx];
    if (row.id) {
      update(idx, { saving: true });
      try {
        await deleteItem(row.id);
      } catch {
        update(idx, { saving: false });
        return;
      }
    }
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow(prev.length)]);
  }

  return (
    <div className="space-y-2">
      {rows.length === 0 && !readOnly && (
        <p className="text-sm text-gray-400 text-center py-4">
          Nenhuma ação ainda. Clique em "Adicionar ação" para começar.
        </p>
      )}
      {rows.length === 0 && readOnly && (
        <p className="text-sm text-gray-400 text-center py-4">Nenhuma ação registrada.</p>
      )}

      {rows.map((row, idx) => (
        <div
          key={`${row.id ?? "new"}-${idx}`}
          className="border border-gray-200 rounded-lg bg-white p-3 space-y-2"
        >
          {/* Linha 1: categoria + ação + status + botões */}
          <div className="flex items-start gap-2">
            {!readOnly ? (
              <select
                value={row.category}
                onChange={(e) => update(idx, { category: e.target.value })}
                className="ap-field text-xs px-1.5 py-1 text-gray-600 shrink-0"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-1 rounded shrink-0">
                {CATEGORY_LABELS[row.category] ?? row.category}
              </span>
            )}

            {!readOnly ? (
              <input
                type="text"
                value={row.action_text}
                onChange={(e) => update(idx, { action_text: e.target.value })}
                placeholder="Descreva a ação..."
                className="ap-field flex-1 min-w-0 text-sm px-2 py-1"
              />
            ) : (
              <span className="flex-1 text-sm text-gray-800">{row.action_text}</span>
            )}

            {!readOnly ? (
              <select
                value={row.status}
                onChange={(e) => update(idx, { status: e.target.value })}
                className={`ap-field text-xs px-1.5 py-1 shrink-0 ${STATUS_CONFIG[row.status]?.color ?? ""}`}
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            ) : (
              <span className={`text-xs shrink-0 font-medium ${STATUS_CONFIG[row.status]?.color ?? ""}`}>
                {STATUS_CONFIG[row.status]?.label ?? row.status}
              </span>
            )}

            {!readOnly && (
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSave(idx)}
                  disabled={row.saving || !row.action_text.trim()}
                  title="Salvar"
                  className={`ap-icon-btn ${
                    row.justSaved
                      ? "bg-green-50 border-green-200 text-green-600"
                      : "hover:bg-gray-50 disabled:opacity-40"
                  }`}
                >
                  {row.justSaved ? <Check className="size-3.5" /> : <Save className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  disabled={row.saving}
                  title="Remover"
                  className="ap-icon-btn hover:text-red-500 hover:border-red-200 disabled:opacity-40"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Linha 2: resultado desejado + resultado real */}
          <div className="grid grid-cols-2 gap-2">
            {!readOnly ? (
              <>
                <div>
                  <label className="ap-label mb-0.5">Resultado desejado</label>
                  <input
                    type="text"
                    value={row.desired_result}
                    onChange={(e) => update(idx, { desired_result: e.target.value })}
                    placeholder="Ex: fechar 2 pedidos"
                    className="ap-field w-full text-xs px-2 py-1"
                  />
                </div>
                <div>
                  <label className="ap-label mb-0.5">Resultado real</label>
                  <input
                    type="text"
                    value={row.actual_result}
                    onChange={(e) => update(idx, { actual_result: e.target.value })}
                    placeholder="Preencher após a ação"
                    className="ap-field w-full text-xs px-2 py-1"
                  />
                </div>
              </>
            ) : (
              <>
                {row.desired_result && (
                  <div>
                    <p className="ap-label">Desejado</p>
                    <p className="text-xs text-gray-600 mt-0.5">{row.desired_result}</p>
                  </div>
                )}
                {row.actual_result && (
                  <div>
                    <p className="ap-label">Real</p>
                    <p className="text-xs text-gray-600 mt-0.5">{row.actual_result}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}

      {!readOnly && (
        <button type="button" onClick={addRow} className="ap-add-btn">
          <Plus className="size-4" /> Adicionar ação
        </button>
      )}
    </div>
  );
}
