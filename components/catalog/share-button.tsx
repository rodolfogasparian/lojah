"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // usuário cancelou o compartilhamento
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleShare}
      className="h-10 w-full"
    >
      {copied ? (
        <>
          <Check /> Link copiado!
        </>
      ) : (
        <>
          <Share2 /> Compartilhar
        </>
      )}
    </Button>
  );
}
