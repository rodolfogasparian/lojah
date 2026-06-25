import { PlayCircle, BookOpen, ExternalLink } from "lucide-react";
import { VideoModal } from "@/components/seller/VideoModal";

interface Material {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  type: string;
}

interface Props {
  materiais: Material[];
}

export function MaterialCard({ materiais }: Props) {
  if (materiais.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-xl border">
        <p className="text-muted-foreground text-sm">Nenhum material disponível ainda.</p>
        <p className="text-muted-foreground text-xs mt-1">
          Em breve o administrador adicionará tutoriais e vídeos aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {materiais.map((m) => (
        <div key={m.id} className="bg-white rounded-xl border px-4 py-3 flex items-center gap-4">
          <div className="shrink-0">
            {m.type === "VIDEO"
              ? <PlayCircle className="size-8 text-blue-400" />
              : <BookOpen className="size-8 text-green-500" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{m.title}</p>
            {m.content && (
              <p className="text-xs text-muted-foreground mt-0.5" style={{ whiteSpace: "pre-wrap" }}>
                {m.content}
              </p>
            )}
          </div>
          {m.url && (
            m.type === "VIDEO" ? (
              <VideoModal url={m.url} title={m.title} />
            ) : (
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Acessar <ExternalLink className="size-3" />
              </a>
            )
          )}
        </div>
      ))}
    </div>
  );
}
