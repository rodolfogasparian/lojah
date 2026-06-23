"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Copy, Check } from "lucide-react";

const PACKS = [
  { id: "1-anual", label: "1 cupom anual", quantidade: 1, valor: 67, descricao: "de R$ 197" },
  { id: "10-anual", label: "10 cupons anuais", quantidade: 10, valor: 370, descricao: "de R$ 1.970" },
];

const PIX_KEY = "whapspro@gmail.com";
const WHATSAPP_ADMIN = "45999463907";

interface Props {
  sellerName: string;
  sellerSlug: string;
}

export function CouponPurchaseModal({ sellerName, sellerSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(PACKS[0]);
  const [pixCopied, setPixCopied] = useState(false);
  const [step, setStep] = useState<"select" | "pix">("select");

  function handleCopyPix() {
    navigator.clipboard.writeText(PIX_KEY);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  }

  function handleJaPaguei() {
    const msg = encodeURIComponent(
      `Olá! Acabei de realizar o pagamento via PIX para compra de cupons.\n\n` +
      `👤 Nome: ${sellerName}\n` +
      `🔗 Usuário: ${sellerSlug}\n` +
      `📦 Pack: ${selectedPack.label}\n` +
      `💰 Valor: R$ ${selectedPack.valor},00\n\n` +
      `Aguardo a liberação dos cupons. Obrigado!`
    );
    window.open(`https://wa.me/${WHATSAPP_ADMIN}?text=${msg}`, "_blank");
    setOpen(false);
    setStep("select");
  }

  function handleClose() {
    setOpen(false);
    setStep("select");
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <ShoppingCart className="size-4" />
        Comprar cupons
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-5 p-6">

            {step === "select" && (
              <>
                <div>
                  <h2 className="font-bold text-lg">Comprar cupons</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Escolha o pack e pague via PIX. Após o pagamento, avise o administrador e os cupons serão liberados.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {PACKS.map(pack => (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPack(pack)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                        selectedPack.id === pack.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{pack.label}</p>
                          <p className="text-xs text-muted-foreground line-through">{pack.descricao}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">R$ {pack.valor}</p>
                          {pack.quantidade > 1 && (
                            <p className="text-xs text-muted-foreground">
                              R$ {(pack.valor / pack.quantidade).toFixed(0)}/cupom
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleClose}>Cancelar</Button>
                  <Button onClick={() => setStep("pix")}>
                    Continuar
                  </Button>
                </div>
              </>
            )}

            {step === "pix" && (
              <>
                <div>
                  <h2 className="font-bold text-lg">Pagamento via PIX</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedPack.label} — <span className="font-semibold text-foreground">R$ {selectedPack.valor},00</span>
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Chave PIX</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold flex-1">{PIX_KEY}</span>
                    <button
                      onClick={handleCopyPix}
                      className="p-2 rounded-lg bg-white border border-border hover:bg-gray-100 transition-colors"
                    >
                      {pixCopied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Após pagar, clique em "Já paguei" para avisar o administrador via WhatsApp.
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setStep("select")}>Voltar</Button>
                  <Button onClick={handleJaPaguei} className="bg-green-600 hover:bg-green-700 text-white">
                    Já paguei — Avisar admin
                  </Button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
