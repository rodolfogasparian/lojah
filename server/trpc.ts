import { initTRPC } from "@trpc/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function createContext() {
  const session = await auth();
  return { db, session };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
