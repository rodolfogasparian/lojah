import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/shared/register-form";
import { getCompanyFromHost } from "@/lib/tenant";

const TITLE = "Faça o seu cadastro para ter um Catálogo Online!";
const DESCRIPTION = "Crie sua conta gratuitamente e tenha seu catálogo online personalizado com a Atlântica Natural.";
const OG_IMAGE = "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-branco.png";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function CadastroPage() {
  const company = await getCompanyFromHost();

  if (!company) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Empresa não identificada</CardTitle>
            <CardDescription>
              Acesse o link da sua empresa para se cadastrar.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img
            src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-preto.jpg"
            alt="Atlântica Natural"
            className="w-16 h-16 object-contain rounded-xl"
          />
          <div className="w-px h-10 bg-gray-200" />
          <img
            src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-loja-preto.png"
            alt="Lojah"
            className="h-8 object-contain"
          />
        </div>
        <CardHeader>
          <CardTitle>Crie sua Loja Online</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta na Atlântica Natural:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm companyId={company.id} companySlug={company.slug} />
        </CardContent>
      </Card>
    </div>
  );
}
