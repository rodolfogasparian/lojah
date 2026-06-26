import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "@/server/trpc";
import { hashPassword } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(2, "Informe seu nome completo."),
        slug: z.string().trim().min(2, "Informe um link personalizado."),
        email: z.email(),
        password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
        companyId: z.string().min(1, "Empresa não identificada."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: { id: input.companyId },
      });

      if (!company) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Empresa não encontrada. Acesse o link da sua empresa para se cadastrar.",
        });
      }

      const existing = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Já existe uma conta com este email.",
        });
      }

      const slug = slugify(input.slug);
      if (!slug) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Informe um link personalizado válido.",
        });
      }

      const slugOwner = await ctx.db.sellerProfile.findUnique({
        where: { company_id_slug: { company_id: company.id, slug } },
      });

      if (slugOwner) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Esse link já está em uso. Escolha outro.",
        });
      }

      const password_hash = await hashPassword(input.password);

      const user = await ctx.db.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: { email: input.email, password_hash, company_id: company.id },
        });

        // active: false até o vendedor concluir a ativação (cupom ou
        // pagamento) — evita que a vitrine pública fique acessível antes
        // disso.
        await tx.sellerProfile.create({
          data: {
            user_id: createdUser.id,
            company_id: company.id,
            slug,
            name: input.name,
            active: false,
            signup_button_url: "https://cadastro.atlanticanatural.com.br/" + slug,
          },
        });

        return createdUser;
      });

      return { id: user.id, email: user.email };
    }),
});
