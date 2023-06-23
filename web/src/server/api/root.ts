import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { bumpsRouter } from "~/server/api/routers/bumps";
import { discordRouter } from "~/server/api/routers/discord";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  bumps: bumpsRouter,
  discord: discordRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
