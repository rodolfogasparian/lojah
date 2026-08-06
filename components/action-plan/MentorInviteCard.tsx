"use client";

import { useState, useEffect } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";

type Props = {
  slug: string;
};

export function MentorInviteCard({ slug }: Props) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const inviteUrl = origin ? `${origin}/m/${slug}` : `/m/${slug}`;
  const waText = encodeURIComponent(
    `Olá! Use este link para se conectar comigo no Plano de Ação e começarmos seu acompanhamento:\n${inviteUrl}`
  );
  const waLink = `https://wa.me/?text=${waText}`;

  function handleCopy() {
    navigator.clipboard.writeText(inviteUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        // Fallback: selecionar o texto manualmente se clipboard API falhar
        const el = document.createElement("textarea");
        el.value = inviteUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white p-4 space-y-3">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Seu link de convite
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-700 font-mono break-all">{inviteUrl}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 leading-snug">
          Compartilhe com seus orientados. Ao acessar e confirmar, eles ficam vinculados ao seu acompanhamento e você passa a ver o plano semanal deles.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
            copied
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copiado!" : "Copiar link"}
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="size-4" />
          Enviar no WhatsApp
        </a>
      </div>
    </div>
  );
}
