import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { db } from "@/lib/db";

const SALT_ROUNDS = 10;

export function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "SUPERADMIN" | "COMPANY_ADMIN" | "SELLER";
      companyId: string | null;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password_hash) {
          return null;
        }

        const isValidPassword = await compare(
          credentials.password as string,
          user.password_hash
        );

        console.log("[AUTH DEBUG]", {
          email: credentials.email,
          userFound: !!user,
          hasHash: !!user?.password_hash,
          passwordMatch: user ? await compare(credentials.password as string, user.password_hash!) : false,
        });

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          companyId: user.company_id,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes("/painel") || url === baseUrl) {
        return url.includes("/painel") ? url : `${baseUrl}/painel`;
      }
      return url.startsWith(baseUrl) ? url : `${baseUrl}/painel`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.companyId = (user as { companyId: string | null }).companyId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "SUPERADMIN" | "COMPANY_ADMIN" | "SELLER";
      session.user.companyId = token.companyId as string | null;
      return session;
    },
  },
});
