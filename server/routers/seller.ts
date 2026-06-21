import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/server/trpc";
import { slugify } from "@/lib/utils";

const profileInput = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo."),
  slug: z.string().trim().min(2, "Informe um link personalizado."),
  photo_url: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  bio: z.string().trim().max(500, "A bio pode ter no máximo 500 caracteres.").optional(),
  signup_button_text: z.string().trim().optional(),
  signup_button_url: z.string().trim().optional(),
});

export const sellerRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.sellerProfile.findUnique({
      where: { user_id: ctx.session.user.id },
    });
  }),

  upsert: protectedProcedure
    .input(profileInput)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.session.user.companyId;

      if (!companyId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Sua conta ainda não está vinculada a uma empresa.",
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
        where: { company_id_slug: { company_id: companyId, slug } },
      });

      if (slugOwner && slugOwner.user_id !== ctx.session.user.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Esse link já está em uso por outro vendedor.",
        });
      }

      const data = {
        company_id: companyId,
        slug,
        name: input.name,
        photo_url: input.photo_url || null,
        whatsapp: input.whatsapp || null,
        instagram: input.instagram || null,
        city: input.city || null,
        state: input.state || null,
        bio: input.bio || null,
        signup_button_text: input.signup_button_text || null,
        signup_button_url: input.signup_button_url || null,
      };

      return ctx.db.sellerProfile.upsert({
        where: { user_id: ctx.session.user.id },
        create: { ...data, user_id: ctx.session.user.id },
        update: data,
      });
    }),
});
