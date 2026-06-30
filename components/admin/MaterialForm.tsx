"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check, X, Plus, PlayCircle, BookOpen } from "lucide-react";

interface Material {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  type: string;
  sort_order: number;
  active: boolean;
}

interface Props {
  initialMateriais: Material[];
}

type FormData = {
  title: string;
  content: string;
  url: string;
  type: string;
  sort_order: number;
};

function TypeIcon({ type }: { type: string }) {
  return type === "VIDEO"
    ? <PlayCircle className="size-4 text-blue-500 shrink-0" />
    : <BookOpen className="size-4 text-green-500 shrink-0" />;
}

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={data.sort_order}
          onChange={e => onChange({ ...data, sort_order: Number(e.target.value) })}
          className="w-16 border border-border rounded-lg px-2 py-1.5 text-sm bg-gray-50 text-center"
          placeholder="Ordem"
        />
        <select
          value={data.type}
          onChange={e => onChange({ ...data, type: e.target.value })}
          className="border border-border rounded-lg px-3 py-1.5 text-sm bg-gray-50"
        >
          <option value="TUTORIAL">Tutorial</option>
          <option value="VIDEO">Vídeo</option>
          <option value="TUTORIAL">Documento</option>
        </select>
        <input
          value={data.title}
          onChange={e => onChange({ ...data, title: e.target.value })}
          className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm bg-gray-50"
          placeholder="Título"
        />
      </div>
      <input
        value={data.url}
        onChange={e => onChange({ ...data, url: e.target.value })}
        className="w-full border border-border rounded-lg px-3 py-1.5 text-sm bg-gray-50"
        placeholder="Link (YouTube, Google Drive, PDF, PowerPoint...)"
      />
      <textarea
        value={data.content}
        onChange={e => onChange({ ...data, content: e.target.value })}
        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-gray-50 resize-none"
        rows={2}
        placeholder="Descrição curta (opcional)"
      />
    </div>
  );
}

export function MaterialForm({ initialMateriais }: Props) {
  const [materiais, setMateriais] = useState<Material[]>(initialMateriais);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<FormData>({ title: "", content: "", url: "", type: "TUTORIAL", sort_order: 0 });
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState<FormData>({ title: "", content: "", url: "", type: "TUTORIAL", sort_order: 0 });
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!newData.title) return;
    setLoading(true);
    const res = await fetch("/api/admin/materiais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
    const created = await res.json();
    setMateriais(prev => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
    setNewData({ title: "", content: "", url: "", type: "TUTORIAL", sort_order: 0 });
    setShowNew(false);
    setLoading(false);
  }

  function startEdit(m: Material) {
    setEditingId(m.id);
    setEditData({ title: m.title, content: m.content ?? "", url: m.url ?? "", type: m.type, sort_order: m.sort_order });
  }

  async function handleSaveEdit(id: string) {
    setLoading(true);
    await fetch(`/api/admin/materiais/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setMateriais(prev =>
      prev.map(m => m.id === id ? { ...m, ...editData } : m)
          .sort((a, b) => a.sort_order - b.sort_order)
    );
    setEditingId(null);
    setLoading(false);
  }

  async function handleToggleActive(m: Material) {
    await fetch(`/api/admin/materiais/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !m.active }),
    });
    setMateriais(prev => prev.map(item => item.id === m.id ? { ...item, active: !item.active } : item));
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este material?")) return;
    await fetch(`/api/admin/materiais/${id}`, { method: "DELETE" });
    setMateriais(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      {materiais.map((m) => (
        <div key={m.id} className={`bg-white rounded-xl border overflow-hidden ${!m.active ? "opacity-60" : ""}`}>
          {editingId === m.id ? (
            <div className="p-4 flex flex-col gap-3">
              <FormFields data={editData} onChange={setEditData} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setEditingId(null)} disabled={loading}>
                  <X className="size-3 mr-1" /> Cancelar
                </Button>
                <Button size="sm" onClick={() => handleSaveEdit(m.id)} disabled={loading}>
                  <Check className="size-3 mr-1" /> Salvar
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground w-5 text-center shrink-0">{m.sort_order}</span>
              {m.url ? (
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <TypeIcon type={m.type} />
                </a>
              ) : (
                <TypeIcon type={m.type} />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{m.title}</p>
                {m.content && <p className="text-xs text-muted-foreground mt-0.5 truncate">{m.content}</p>}
                {m.url && <p className="text-xs text-blue-500 mt-0.5 truncate">{m.url}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleActive(m)}
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                    m.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {m.active ? "Ativo" : "Oculto"}
                </button>
                <button onClick={() => startEdit(m)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <Pencil className="size-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="size-3.5 text-red-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {showNew ? (
        <div className="bg-white rounded-xl border p-4 flex flex-col gap-3">
          <FormFields data={newData} onChange={setNewData} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowNew(false)} disabled={loading}>
              <X className="size-3 mr-1" /> Cancelar
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={loading || !newData.title}>
              <Check className="size-3 mr-1" /> {loading ? "Salvando..." : "Criar"}
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <Plus className="size-4" /> Novo material
        </button>
      )}
    </div>
  );
}
