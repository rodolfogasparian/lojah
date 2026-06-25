"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";

function getYouTubeId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

interface Props {
  url: string;
  title: string;
}

export function VideoModal({ url, title }: Props) {
  const [open, setOpen] = useState(false);
  const youtubeId = getYouTubeId(url);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        Acessar <ExternalLink className="size-3" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar — mínimo 44px para toque fácil */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="absolute -top-14 right-0 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white"
              style={{ width: 44, height: 44 }}
            >
              <X className="size-6" />
            </button>

            <p className="text-white text-sm font-semibold mb-3 pr-14 truncate">
              {title}
            </p>

            <div style={{ aspectRatio: "16/9" }}>
              {youtubeId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title={title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  style={{ borderRadius: 8, display: "block" }}
                />
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={url}
                  title={title}
                  frameBorder="0"
                  allowFullScreen
                  style={{ borderRadius: 8, display: "block" }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
