import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bumpsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        server: z.string(),
        month: z.number().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.discordBumps.findMany({
        where: {
          sid: input.server,
          month: input.month || new Date().getMonth() + 1,
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
