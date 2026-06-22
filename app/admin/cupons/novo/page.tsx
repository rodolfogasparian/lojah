import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewCouponPackForm } from "@/components/admin/NewCouponPackForm";

export default function NovoCupomPage() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold">Novo Pack de Cupons</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gere cupons únicos para ativar contas de vendedores.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurar pack</CardTitle>
        </CardHeader>
        <CardContent>
          <NewCouponPackForm />
        </CardContent>
      </Card>
    </div>
  );
}
