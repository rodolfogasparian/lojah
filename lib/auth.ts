import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";

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

        // TODO: comparar `credentials.password` com `user.password_hash`
        // usando uma lib de hash (ex: bcrypt) assim que ela for adicionada ao projeto.

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
