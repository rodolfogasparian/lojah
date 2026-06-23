"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";

interface FaqItem {
  id: string;
  title: string;
  content: string;
  sort_order: number;
  active: boolean;
}

interface Props {
  initialFaqs: FaqItem[];
}

export function FaqForm({ initialFaqs }: Props) {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", content: "", sort_order: 0 });
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({ title: "", content: "", sort_order: 0 });
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!newData.title || !newData.content) return;
    setLoading(true);
    const res = await fetch("/api/admin/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
    const created = await res.json();
    setFaqs(prev => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
    setNewData({ title: "", content: "", sort_order: 0 });
    setShowNew(false);
    setLoading(false);
  }

  function startEdit(faq: FaqItem) {
    setEditingId(faq.id);
    setEditData({ title: faq.title, content: faq.content ?? "", sort_order: faq.sort_order });
  }

  async function handleSaveEdit(id: string) {
    setLoading(true);
    await fetch(`/api/admin/faq/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setFaqs(prev =>
      prev.map(f => f.id === id ? { ...f, ...editData } : f)
          .sort((a, b) => a.sort_order - b.sort_order)
    );
    setEditingId(null);
    setLoading(false);
  }

  async function handleToggleActive(faq: FaqItem) {
    await fetch(`/api/admin/faq/${faq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !faq.active }),
    });
    setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, active: !f.active } : f));
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta pergunta?")) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    setFaqs(prev => prev.filter(f => f.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq) => (
        <div key={faq.id} className={`bg-white rounded-xl border overflow-hidden ${!faq.active ? "opacity-60" : ""}`}>
          {editingId === faq.id ? (
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editData.sort_order}
                  onChange={e => setEditData(p => ({ ...p, sort_order: Number(e.target.value) }))}
                  className="w-16 border border-border rounded-lg px-2 py-1.5 text-sm bg-gray-50 text-center"
                  placeholder="Ordem"
                />
                <input
                  value={editData.title}
                  onChange={e => setEditData(p => ({ ...p, title: e.target.value }))}
                  className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm bg-gray-50"
                  placeholder="Pergunta"
                />
              </div>
              <textarea
                value={editData.content}
                onChange={e => setEditData(p => ({ ...p, content: e.target.value }))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-gray-50 resize-none"
                rows={3}
                placeholder="Resposta"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setEditingId(null)} disabled={loading}>
                  <X className="size-3 mr-1" /> Cancelar
                </Button>
                <Button size="sm" onClick={() => handleSaveEdit(faq.id)} disabled={loading}>
                  <Check className="size-3 mr-1" /> Salvar
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 flex items-start gap-3">
              <span className="mt-0.5 text-xs font-bold text-muted-foreground w-5 text-center shrink-0">
                {faq.sort_order}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{faq.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{faq.content}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleActive(faq)}
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                    faq.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {faq.active ? "Ativo" : "Oculto"}
                </button>
                <button onClick={() => startEdit(faq)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <Pencil className="size-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => handleDelete(faq.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="size-3.5 text-red-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {showNew ? (
        <div className="bg-white rounded-xl border p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newData.sort_order}
              onChange={e => setNewData(p => ({ ...p, sort_order: Number(e.target.value) }))}
              className="w-16 border border-border rounded-lg px-2 py-1.5 text-sm bg-gray-50 text-center"
              placeholder="Ordem"
            />
            <input
              value={newData.title}
              onChange={e => setNewData(p => ({ ...p, title: e.target.value }))}
              className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm bg-gray-50"
              placeholder="Pergunta"
            />
          </div>
          <textarea
            value={newData.content}
            onChange={e => setNewData(p => ({ ...p, content: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-gray-50 resize-none"
            rows={3}
            placeholder="Resposta"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowNew(false)} disabled={loading}>
              <X className="size-3 mr-1" /> Cancelar
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={loading || !newData.title || !newData.content}>
              <Check className="size-3 mr-1" /> {loading ? "Salvando..." : "Criar"}
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <Plus className="size-4" /> Nova pergunta
        </button>
      )}
    </div>
  );
}
