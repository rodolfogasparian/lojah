"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  seller: {
    id: string;
    name: string;
    slug: string;
    whatsapp: string | null;
    instagram: string | null;
    city: string | null;
    state: string | null;
    status: string;
  };
  userEmail: string;
};

export function AdminSellerForm({ seller, userEmail }: Props) {
  const router = useRouter();
  const [name, setName] = useState(seller.name);
  const [slug, setSlug] = useState(seller.slug);
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState(seller.whatsapp ?? "");
  const [status, setStatus] = useState(seller.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await fetch(`/api/admin/vendedores/${seller.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, email, password: password || undefined, whatsapp, status }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao salvar.");
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {success && <Alert><AlertDescription>✅ Dados salvos com sucesso!</AlertDescription></Alert>}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Nome completo</Label>
          <Input className="bg-gray-50" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Usuário (link)</Label>
          <Input className="bg-gray-50" value={slug} onChange={e => setSlug(e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input type="email" className="bg-gray-50" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Nova senha <span className="text-muted-foreground text-xs">(deixe em branco para não alterar)</span></Label>
          <Input type="password" className="bg-gray-50" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>WhatsApp</Label>
          <Input className="bg-gray-50" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <select
            className="bg-gray-50 border border-input rounded-md px-3 py-2 text-sm"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="PENDING">Pendente</option>
            <option value="ACTIVE">Ativo</option>
            <option value="SUSPENDED">Suspenso</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar alterações"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/vendedores")}>
          Voltar
        </Button>
      </div>
    </form>
  );
}
