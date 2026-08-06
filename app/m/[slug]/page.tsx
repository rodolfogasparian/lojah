import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { acceptInvite } from "@/app/painel/plano-de-acao/actions";

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  // Sem sessão: pede login
  if (!session?.user) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center space-y-4">
          <p className="text-4xl">🤝</p>
          <h1 className="text-xl font-bold text-gray-800">Você recebeu um convite</h1>
          <p className="text-sm text-gray-500">
            Para aceitar o convite de orientação, primeiro faça login na sua conta.
          </p>
          <Link
            href="/login"
            className="inline-block bg-primary text-primary-foreground font-semibold text-sm px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Fazer login
          </Link>
          <p className="text-xs text-gray-400">
            Após o login, acesse novamente este link para confirmar o convite.
          </p>
        </div>
      </div>
    );
  }

  // Usuário sem seller profile (ex: COMPANY_ADMIN)
  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    select: { id: true, company_id: true, name: true },
  });

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center space-y-3">
          <p className="text-4xl">⚠️</p>
          <h1 className="text-lg font-bold text-gray-800">Acesso restrito</h1>
          <p className="text-sm text-gray-500">
            Apenas consultores podem aceitar convites de orientação.
          </p>
          <Link href="/painel" className="inline-block text-sm text-primary font-semibold hover:underline">
            Ir ao painel
          </Link>
        </div>
      </div>
    );
  }

  // Busca o mentor pelo slug dentro da mesma empresa
  const mentor = await db.sellerProfile.findFirst({
    where: { slug, company_id: profile.company_id, active: true },
    select: { id: true, name: true, slug: true },
  });

  if (!mentor) notFound();

  // Tentativa de ser orientado de si mesmo
  if (mentor.id === profile.id) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center space-y-3">
          <p className="text-4xl">🙈</p>
          <h1 className="text-lg font-bold text-gray-800">Esse link é seu!</h1>
          <p className="text-sm text-gray-500">
            Este é o seu próprio link de convite. Compartilhe com quem você quer acompanhar.
          </p>
          <Link
            href="/painel/plano-de-acao/convite"
            className="inline-block text-sm text-primary font-semibold hover:underline"
          >
            Ver meu link de convite
          </Link>
        </div>
      </div>
    );
  }

  // Verifica vínculo existente
  const existing = await db.mentorship.findUnique({
    where: { mentor_id_mentee_id: { mentor_id: mentor.id, mentee_id: profile.id } },
  });

  if (existing?.status === "ACTIVE") {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center space-y-3">
          <p className="text-4xl">✅</p>
          <h1 className="text-lg font-bold text-gray-800">Vínculo já ativo</h1>
          <p className="text-sm text-gray-500">
            Você já está vinculado(a) a <strong>{mentor.name}</strong> como orientador(a).
          </p>
          <Link
            href="/painel/plano-de-acao/meu"
            className="inline-block text-sm text-primary font-semibold hover:underline"
          >
            Ir ao meu plano
          </Link>
        </div>
      </div>
    );
  }

  // Ação de aceitar (form bound com o slug)
  const handleAccept = acceptInvite.bind(null, slug);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center space-y-2">
          <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {mentor.name.slice(0, 2).toUpperCase()}
          </div>
          <h1 className="text-xl font-bold text-gray-800">Convite de orientação</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>{mentor.name}</strong> quer te acompanhar como orientador(a) no Plano de Ação.
            Ao aceitar, {mentor.name.split(" ")[0]} poderá ver seus planos semanais e acompanhar sua evolução.
          </p>
        </div>

        <div className="border border-gray-100 rounded-xl bg-gray-50 px-4 py-3 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">O que acontece ao aceitar</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• {mentor.name.split(" ")[0]} passa a ver seus planos semanais</li>
            <li>• Você pode encerrar o vínculo a qualquer momento</li>
            <li>• Seus dados permanecem privados para outros</li>
          </ul>
        </div>

        <form action={handleAccept} className="space-y-3">
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold text-sm px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Aceitar convite de {mentor.name.split(" ")[0]}
          </button>
          <Link
            href="/painel/plano-de-acao/meu"
            className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Agora não
          </Link>
        </form>
      </div>
    </div>
  );
}
