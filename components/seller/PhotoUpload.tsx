"use client";
import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";

type Props = {
  currentPhotoUrl: string | null;
  sellerName: string;
  onUploadSuccess: (url: string) => void;
};

async function compressImage(file: File, maxSizeKB = 400, maxDimension = 400): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= maxSizeKB * 1024 || quality <= 0.3) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          "image/jpeg",
          quality
        );
      };
      tryCompress();
    };
    img.src = url;
  });
}

export function PhotoUpload({ currentPhotoUrl, sellerName, onUploadSuccess }: Props) {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const compressed = await compressImage(file);
      const localPreview = URL.createObjectURL(compressed);
      setPreview(localPreview);
      const formData = new FormData();
      formData.append("file", compressed);
      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao fazer upload");
        setPreview(currentPhotoUrl);
        return;
      }
      onUploadSuccess(data.url);
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setPreview(currentPhotoUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="relative size-24 rounded-full overflow-hidden bg-gray-100 border-2 border-border hover:opacity-80 transition-opacity flex items-center justify-center"
      >
        {preview ? (
          <img src={preview} alt={sellerName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-muted-foreground">
            {sellerName.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          {loading
            ? <Loader2 className="size-6 text-white animate-spin" />
            : <Camera className="size-6 text-white" />
          }
        </div>
      </button>
      <p className="text-[11px] text-muted-foreground">Clique para trocar a foto</p>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
