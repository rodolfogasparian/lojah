import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "lojah.app";

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

/**
 * Em desenvolvimento, acessar "localhost:3000" direto (sem subdomínio) é
 * tratado como se fosse esse tenant — evita precisar editar o arquivo hosts
 * do Windows só para testar a vitrine pública localmente.
 * Nunca tem efeito em produção (`NODE_ENV === "production"`).
 */
const DEV_FALLBACK_TENANT_SLUG = "atlantica";

/**
 * Lê o host da requisição atual e extrai o slug da empresa pelo subdomínio.
 * Ex: "acme.lojah.app" -> "acme". Em desenvolvimento local, também aceita
 * "acme.localhost:3000" (navegadores resolvem *.localhost para 127.0.0.1
 * automaticamente, sem precisar editar o arquivo hosts).
 * Retorna `null` quando o host não tem subdomínio de empresa (ex: "lojah.app").
 */
export async function getCompanySlugFromHost(): Promise<string | null> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const hostname = host.split(":")[0];

  if (hostname.endsWith(`.${APP_DOMAIN}`)) {
    const subdomain = hostname.slice(0, -(APP_DOMAIN.length + 1));
    return subdomain === "www" ? null : subdomain;
  }

  if (hostname.endsWith(".localhost")) {
    return hostname.slice(0, -".localhost".length);
  }

  if (hostname === "localhost" && process.env.NODE_ENV !== "production") {
    return DEV_FALLBACK_TENANT_SLUG;
  }

  return null;
}

/**
 * Busca a empresa (tenant) correspondente ao subdomínio da requisição atual.
 * Use nas páginas públicas da vitrine (ex: app/(public)/[slug]/page.tsx).
 */
export async function getCompanyFromHost() {
  const slug = await getCompanySlugFromHost();

  if (!slug) {
    return null;
  }

  return db.company.findUnique({ where: { slug } });
}
