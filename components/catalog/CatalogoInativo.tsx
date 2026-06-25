"use client";

interface CatalogoInativoProps {
  vendedorNome: string;
  vendedorWhatsapp: string | null;
  isOwner: boolean;
}

export default function CatalogoInativo({
  vendedorNome,
  vendedorWhatsapp,
  isOwner,
}: CatalogoInativoProps) {
  const whatsappDigits = vendedorWhatsapp?.replace(/\D/g, "");
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent("Olá! Vi que seu catálogo está inativo.")}`
    : null;

  return (
    <div
      style={{ backgroundColor: "#f5f0e8" }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-[400px] flex flex-col items-center gap-6 text-center">
        {/* Ícone */}
        <div className="text-6xl select-none">🔒</div>

        {/* Textos */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-[#1a1a1a]">
            Catálogo temporariamente inativo
          </h1>
          <p className="text-sm text-[#555555]">
            Entre em contato com o consultor ou renove o acesso.
          </p>
        </div>

        {/* Botões */}
        <div className="w-full flex flex-col gap-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-lg font-semibold text-sm text-[#1a1a1a] text-center transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#cfee9a" }}
            >
              Falar com {vendedorNome}
            </a>
          )}

          {isOwner && (
            <button
              onClick={() => alert("Em breve")}
              className="w-full py-3 px-6 rounded-lg font-semibold text-sm text-white text-center transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              Renovar meu catálogo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
