import { router } from "@/server/trpc";
import { userRouter } from "@/server/routers/user";
import { sellerRouter } from "@/server/routers/seller";

export const appRouter = router({
  user: userRouter,
  seller: sellerRouter,
});

export type AppRouter = typeof appRouter;
