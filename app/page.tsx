import Link from "next/link";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/shared/logout-button";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: "Super administrador",
  COMPANY_ADMIN: "Administrador da empresa",
  SELLER: "Vendedor",
};

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        {session?.user ? (
          <>
            <CardHeader>
              <CardTitle>Você está logado</CardTitle>
              <CardDescription>{session.user.email}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Perfil: {ROLE_LABELS[session.user.role] ?? session.user.role}
              </p>
              <LogoutButton />
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Você não está logado</CardTitle>
              <CardDescription>
                Entre ou crie uma conta para continuar.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link href="/login" className={cn(buttonVariants(), "flex-1")}>
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
              >
                Cadastrar
              </Link>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
