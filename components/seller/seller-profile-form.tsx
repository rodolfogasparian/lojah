"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PhotoUpload } from "./PhotoUpload";

type SellerProfile = {
  name: string;
  slug: string;
  photo_url: string | null;
  whatsapp: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  facebook: string | null;
  other_link: string | null;
  other_link_label: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  signup_button_text: string | null;
  signup_button_url: string | null;
};

type UpsertResponse =
  | { result: { data: SellerProfile } }
  | { error: { message: string } };

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
      {children}
    </h2>
  );
}

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
  const [youtube, setYoutube] = useState(initialProfile?.youtube ?? "");
  const [tiktok, setTiktok] = useState(initialProfile?.tiktok ?? "");
  const [facebook, setFacebook] = useState(initialProfile?.facebook ?? "");
  const [otherLink, setOtherLink] = useState(initialProfile?.other_link ?? "");
  const [otherLinkLabel, setOtherLinkLabel] = useState(
    initialProfile?.other_link_label ?? ""
  );
  const [city, setCity] = useState(initialProfile?.city ?? "");
  const [state, setState] = useState(initialProfile?.state ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [signupButtonText, setSignupButtonText] = useState(
    initialProfile?.signup_button_text ?? ""
  );
  const [signupButtonUrl, setSignupButtonUrl] = useState(
    initialProfile?.signup_button_url ?? ""
  );
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
        youtube,
        tiktok,
        facebook,
        other_link: otherLink,
        other_link_label: otherLinkLabel,
        city,
        state,
        bio,
        signup_button_text: signupButtonText,
        signup_button_url: signupButtonUrl,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PhotoUpload
        currentPhotoUrl={photoUrl || null}
        sellerName={name}
        onUploadSuccess={(url) => setPhotoUrl(url)}
      />

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

      <div className="flex flex-col gap-4">
        <SectionLabel>Dados pessoais</SectionLabel>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            required
            className="bg-gray-50"
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
            className="bg-gray-50"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Sua página: {publicBaseUrl}/{slug || "seu-nome"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              placeholder="(11) 91234-5678"
              className="bg-gray-50"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="@seu_usuario"
              className="bg-gray-50"
              value={instagram}
              onChange={(event) => setInstagram(event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              className="bg-gray-50"
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
              className="bg-gray-50"
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
            className="bg-gray-50"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionLabel>Redes sociais — preencha apenas o que usar</SectionLabel>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              placeholder="@seu_canal"
              className="bg-gray-50"
              value={youtube}
              onChange={(event) => setYoutube(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input
              id="tiktok"
              placeholder="@seu_usuario"
              className="bg-gray-50"
              value={tiktok}
              onChange={(event) => setTiktok(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            placeholder="facebook.com/seu_usuario"
            className="bg-gray-50"
            value={facebook}
            onChange={(event) => setFacebook(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="other_link_label">Texto do link personalizado</Label>
            <Input
              id="other_link_label"
              placeholder="ex: Site, Linktree..."
              className="bg-gray-50"
              value={otherLinkLabel}
              onChange={(event) => setOtherLinkLabel(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="other_link">URL do link personalizado</Label>
            <Input
              id="other_link"
              placeholder="https://..."
              className="bg-gray-50"
              value={otherLink}
              onChange={(event) => setOtherLink(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionLabel>Configuração do catálogo</SectionLabel>

        <div className="flex flex-col gap-2">
          <Label htmlFor="signup_button_text">Texto do botão do catálogo</Label>
          <Input
            id="signup_button_text"
            placeholder="ex: Fazer cadastro"
            className="bg-gray-50"
            value={signupButtonText}
            onChange={(event) => setSignupButtonText(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="signup_button_url">Link do botão do catálogo</Label>
          <Input
            id="signup_button_url"
            placeholder="Sugestão: inserir o link de cadastro Atlântica"
            className="bg-gray-50"
            value={signupButtonUrl}
            onChange={(event) => setSignupButtonUrl(event.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2 h-10">
        {isLoading ? "Salvando..." : "Salvar perfil"}
      </Button>
    </form>
  );
}
