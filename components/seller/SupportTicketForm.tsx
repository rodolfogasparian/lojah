"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = { sellerId: string; companyId: string };

export function SupportTicketForm({ sellerId, companyId }: Props) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/suporte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message, sellerId, companyId }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao enviar chamado.");
      return;
    }

    setSuccess(true);
    setSubject("");
    setMessage("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {success && <Alert><AlertDescription>✅ Chamado enviado! Entraremos em contato em breve.</AlertDescription></Alert>}

      <div className="flex flex-col gap-2">
        <Label>Assunto</Label>
        <Input
          className="bg-gray-50"
          placeholder="Ex: Problema com foto de perfil"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Mensagem</Label>
        <Textarea
          className="bg-gray-50"
          placeholder="Descreva seu problema com detalhes..."
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar chamado"}
      </Button>
    </form>
  );
}
