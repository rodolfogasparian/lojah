import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer style={{ borderTop: "1px solid #e5e7eb" }} className="py-4 px-4 text-center">
        <p className="text-xs text-gray-400">
          Desenvolvido por Sistema Inteligente •{" "}
          <Link
            href="https://atlantica.lojah.app/atlantica"
            className="underline hover:text-gray-600 transition-colors"
          >
            Solicite o Seu Catálogo
          </Link>
        </p>
      </footer>
    </>
  );
}
