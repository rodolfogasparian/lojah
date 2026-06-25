"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, CreditCard, Ticket } from "lucide-react";

export default function AguardandoPage() {
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleCoupon(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/ativar-cupom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon.trim().toUpperCase() }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Cupom inválido.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/painel"), 2000);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-4">
        <img
          src="https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-preto.jpg"
          alt="Atlântica Natural"
          className="w-16 h-16 object-contain mx-auto rounded-xl"
        />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-amber-500" />
              <CardTitle>Conta aguardando ativação</CardTitle>
            </div>
            <CardDescription>
              Escolha uma das opções abaixo para ativar sua conta e começar a usar a plataforma.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Opção 1 — Cupom */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Ticket className="size-5 text-primary" />
              <CardTitle className="text-base">Tenho um código de ativação</CardTitle>
            </div>
            <CardDescription>
              Insira o código que seu consultor te enviou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert>
                <AlertDescription>✅ Conta ativada! Redirecionando para o painel...</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleCoupon} className="flex flex-col gap-3">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="coupon">Código do cupom</Label>
                  <Input
                    id="coupon"
                    placeholder="ex: ATLA-X7K2"
                    className="bg-gray-50 uppercase tracking-widest"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Verificando..." : "Ativar com cupom"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Opção 2 — Pagamento */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-blue-500" />
              <CardTitle className="text-base">Compre sua assinatura por apenas R$ 67/ano!</CardTitle>
            </div>
            <CardDescription>
              Clique abaixo para acessar o link de pagamento e ativar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="https://pay.hotmart.com/M106478390Y"
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Button className="w-full">
                Comprar agora — R$ 67/ano
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Opção 3 — Aguardar */}
        <p className="text-center text-xs text-muted-foreground">
          Ou aguarde seu consultor ativar sua conta manualmente.
        </p>

      </div>
    </div>
  );
}
