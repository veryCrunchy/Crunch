import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bumpsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ server: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.discordBumps.findMany({
        where: {
          sid: input.server,
        },
        select: {
          id: true,
          uid: true,
          bumps: true,
        },
        orderBy: {
          bumps: "desc",
        },
      });
    }),
});
