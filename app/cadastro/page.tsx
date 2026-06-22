import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/shared/register-form";
import { getCompanyFromHost } from "@/lib/tenant";

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
            src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-loja-verde.png"
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
