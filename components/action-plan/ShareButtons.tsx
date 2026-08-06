"use client";

import { useState, useEffect, useTransition } from "react";
import { Link2, Copy, Check, MessageCircle, X } from "lucide-react";
import { createShareLink, revokeShareLink } from "@/app/painel/plano-de-acao/actions";

type Props = {
  weekStart: string;
  initialLink?: { id: string; token: string } | null;
};

export function ShareButtons({ weekStart, initialLink }: Props) {
  const [link, setLink] = useState<{ id: string; token: string } | null>(
    initialLink ?? null
  );
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const publicUrl = link && origin ? `${origin}/p/${link.token}` : null;

  function handleGenerate() {
    startTransition(async () => {
      const result = await createShareLink(weekStart);
      setLink(result);
    });
  }

  function handleCopy() {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleRevoke() {
    if (!link) return;
    startTransition(async () => {
      await revokeShareLink(link.id);
      setLink(null);
    });
  }

  if (!link) {
    return (
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isPending}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        <Link2 className="size-3.5" />
        {isPending ? "Gerando..." : "Compartilhar"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
          copied
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? "Copiado!" : "Copiar link"}
      </button>

      {publicUrl && (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `Veja meu Plano de Ação desta semana:\n${publicUrl}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="size-3" />
          WhatsApp
        </a>
      )}

      <button
        type="button"
        onClick={handleRevoke}
        disabled={isPending}
        title="Revogar link público"
        className="size-7 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors disabled:opacity-60"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}
