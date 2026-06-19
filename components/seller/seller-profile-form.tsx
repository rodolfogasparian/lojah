"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SellerProfile = {
  name: string;
  slug: string;
  photo_url: string | null;
  whatsapp: string | null;
  instagram: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
};

type UpsertResponse =
  | { result: { data: SellerProfile } }
  | { error: { message: string } };

export function SellerProfileForm({
  initialProfile,
  publicBaseUrl,
}: {
  initialProfile: SellerProfile | null;
  publicBaseUrl: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [slug, setSlug] = useState(initialProfile?.slug ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialProfile?.photo_url ?? "");
  const [whatsapp, setWhatsapp] = useState(initialProfile?.whatsapp ?? "");
  const [instagram, setInstagram] = useState(initialProfile?.instagram ?? "");
  const [city, setCity] = useState(initialProfile?.city ?? "");
  const [state, setState] = useState(initialProfile?.state ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const response = await fetch("/api/trpc/seller.upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        photo_url: photoUrl,
        whatsapp,
        instagram,
        city,
        state,
        bio,
      }),
    });
    const data = (await response.json()) as UpsertResponse;

    setIsLoading(false);

    if (!response.ok || "error" in data) {
      setError(
        "error" in data ? data.error.message : "Não foi possível salvar o perfil."
      );
      return;
    }

    setSlug(data.result.data.slug);
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && !error && (
        <Alert>
          <AlertDescription>
            Perfil salvo! Sua página: {publicBaseUrl}/{slug}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">Link personalizado</Label>
        <Input
          id="slug"
          required
          placeholder="seu-nome"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Sua página: {publicBaseUrl}/{slug || "seu-nome"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="photo_url">Foto (link da imagem)</Label>
        <Input
          id="photo_url"
          placeholder="https://..."
          value={photoUrl}
          onChange={(event) => setPhotoUrl(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          id="whatsapp"
          placeholder="(11) 91234-5678"
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          placeholder="@seu_usuario"
          value={instagram}
          onChange={(event) => setInstagram(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            placeholder="SP"
            maxLength={2}
            value={state}
            onChange={(event) => setState(event.target.value.toUpperCase())}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Sobre você</Label>
        <Textarea
          id="bio"
          rows={4}
          maxLength={500}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2 h-10">
        {isLoading ? "Salvando..." : "Salvar perfil"}
      </Button>
    </form>
  );
}
