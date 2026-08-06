"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Check } from "lucide-react";
import { saveGoal, deleteGoal } from "@/app/painel/plano-de-acao/actions";

export type SerializedGoal = {
  id: string;
  label: string;
  target_value: string;
  actual_value: string | null;
  sort_order: number;
};

type GoalState = {
  id?: string;
  label: string;
  target_value: string;
  actual_value: string;
  sort_order: number;
  saving: boolean;
  justSaved: boolean;
};

function makeGoal(g: SerializedGoal): GoalState {
  return {
    id: g.id,
    label: g.label,
    target_value: g.target_value,
    actual_value: g.actual_value ?? "",
    sort_order: g.sort_order,
    saving: false,
    justSaved: false,
  };
}

function emptyGoal(sortOrder: number): GoalState {
  return {
    id: undefined,
    label: "",
    target_value: "",
    actual_value: "",
    sort_order: sortOrder,
    saving: false,
    justSaved: false,
  };
}

type Props = {
  goals: SerializedGoal[];
  weekStart: string;
  readOnly?: boolean;
};

export function GoalsPanel({ goals, weekStart, readOnly = false }: Props) {
  const [rows, setRows] = useState<GoalState[]>(() => goals.map(makeGoal));

  function update(idx: number, patch: Partial<GoalState>) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  async function handleSave(idx: number) {
    const row = rows[idx];
    if (!row.label.trim() || !row.target_value.trim()) return;
    update(idx, { saving: true });
    try {
      const result = await saveGoal({
        id: row.id,
        weekStart,
        label: row.label.trim(),
        target_value: row.target_value.trim(),
        actual_value: row.actual_value.trim() || undefined,
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
        await deleteGoal(row.id);
      } catch {
        update(idx, { saving: false });
        return;
      }
    }
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyGoal(prev.length)]);
  }

  return (
    <div className="space-y-2">
      {rows.length === 0 && !readOnly && (
        <p className="text-sm text-gray-400 text-center py-4">
          Nenhuma meta ainda. Clique em "Adicionar meta" para começar.
        </p>
      )}
      {rows.length === 0 && readOnly && (
        <p className="text-sm text-gray-400 text-center py-4">Nenhuma meta registrada.</p>
      )}

      {rows.map((row, idx) => (
        <div
          key={`${row.id ?? "new"}-${idx}`}
          className="ap-card p-3"
        >
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-start">
            {/* O que atingir */}
            <div className="space-y-1">
              <label className="ap-label">O que atingir</label>
              {!readOnly ? (
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => update(idx, { label: e.target.value })}
                  placeholder="Ex: Vender produtos, fazer contatos..."
                  className="ap-field w-full text-sm px-2 py-1"
                />
              ) : (
                <p className="text-sm text-gray-800">{row.label}</p>
              )}
            </div>

            {/* Meta */}
            <div className="space-y-1 w-32">
              <label className="ap-label">Meta</label>
              {!readOnly ? (
                <input
                  type="text"
                  value={row.target_value}
                  onChange={(e) => update(idx, { target_value: e.target.value })}
                  placeholder="Ex: R$2.000"
                  className="ap-field w-full text-sm px-2 py-1"
                />
              ) : (
                <p className="text-sm text-gray-800 font-semibold">{row.target_value}</p>
              )}
            </div>

            {/* Resultado real */}
            <div className="space-y-1 w-32">
              <label className="ap-label">Resultado real</label>
              {!readOnly ? (
                <input
                  type="text"
                  value={row.actual_value}
                  onChange={(e) => update(idx, { actual_value: e.target.value })}
                  placeholder="Preencher depois"
                  className="ap-field w-full text-sm px-2 py-1"
                />
              ) : (
                <p className="text-sm text-gray-600">{row.actual_value || "—"}</p>
              )}
            </div>

            {/* Botões */}
            {!readOnly && (
              <div className="flex gap-1 pt-5">
                <button
                  type="button"
                  onClick={() => handleSave(idx)}
                  disabled={row.saving || !row.label.trim() || !row.target_value.trim()}
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
        </div>
      ))}

      {!readOnly && (
        <button type="button" onClick={addRow} className="ap-add-btn">
          <Plus className="size-4" /> Adicionar meta
        </button>
      )}
    </div>
  );
}
