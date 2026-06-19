import { auth } from "@/lib/auth";

/**
 * Retorna o `company_id` do usuário logado, ou `null` se não houver
 * sessão ou se o usuário (ex: SUPERADMIN) não estiver vinculado a uma empresa.
 */
export async function getCurrentCompanyId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.companyId ?? null;
}

/**
 * Igual a `getCurrentCompanyId`, mas lança erro se não houver empresa.
 * Use em rotas/handlers que exigem um tenant (ex: COMPANY_ADMIN, SELLER).
 */
export async function requireCompanyId(): Promise<string> {
  const companyId = await getCurrentCompanyId();

  if (!companyId) {
    throw new Error("Nenhuma empresa associada ao usuário logado.");
  }

  return companyId;
}
