import { z } from "zod";
import { TRPCError } from "@trpc/server";
import NodeCache from "node-cache";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
export type UserData = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
};

const cache = new NodeCache();

export const discordRouter = createTRPCRouter({
  getBasicUsersInfo: publicProcedure
    .input(z.object({ users: z.string().array() }))
    .query(async ({ ctx, input }) => {
      const info: UserData[] = [];
      await Promise.all(
        input.users.map(async (user) => {
          const cacheKey = `discord:${user}`;
          const cachedData = cache.get(cacheKey) as UserData | undefined;
          if (cachedData) {
            info.push(cachedData);
            console.log("cached");
          } else {
            const response = await fetch(
              `https://canary.discord.com/api/v10/users/${user}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bot ${String(env.DISCORD_TOKEN)}`,
                },
              }
            );
            if (!response.ok) {
              throw new TRPCError({
                code: "CONFLICT",
                message: response.statusText,
              });
            }
            console.log("fetched");

            const userPromise = response.json() as Promise<UserData>;
            const data = await userPromise;
            info.push(data);
            cache.set(cacheKey, data, 3600);
          }
        })
      );
      return info;
    }),
});
