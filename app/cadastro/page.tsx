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
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Cadastre-se em {company.name} para acessar a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm companyId={company.id} />
        </CardContent>
      </Card>
    </div>
  );
}
