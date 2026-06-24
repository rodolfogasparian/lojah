import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/shared/login-form";

export default function LoginPage() {
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
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Acesse sua conta para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
