import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "@/server/trpc";
import { hashPassword } from "@/lib/auth";

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Já existe uma conta com este email.",
        });
      }

      const password_hash = await hashPassword(input.password);

      const user = await ctx.db.user.create({
        data: { email: input.email, password_hash },
      });

      return { id: user.id, email: user.email };
    }),
});
