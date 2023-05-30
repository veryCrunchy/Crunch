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
export type ServerData = {
  id: string;
  name: string;
};

const cache = new NodeCache();

export const discordRouter = createTRPCRouter({
  getUsersInfo: publicProcedure
    .input(z.object({ users: z.string().array() }))
    .query(async ({ input }) => {
      const info: UserData[] = [];
      await Promise.all(
        input.users.map(async (user) => {
          const cacheKey = `discord:${user}`;
          const cachedData = cache.get(cacheKey) as UserData | undefined;
          if (cachedData) {
            info.push(cachedData);
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

            const userPromise = response.json() as Promise<UserData>;
            const data = await userPromise;
            info.push(data);
            cache.set(cacheKey, data, 18000); //cache for 5 hours
          }
        })
      );
      return info;
    }),
  getUserInfo: publicProcedure
    .input(z.object({ user: z.string() }))
    .query(async ({ input }) => {
      const cacheKey = `discord:${input.user}`;
      const cachedData = cache.get(cacheKey) as UserData | undefined;
      if (cachedData) {
        return cachedData;
      } else {
        const response = await fetch(
          `https://discord.com/api/v10/users/${input.user}`,
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

        const userPromise = response.json() as Promise<UserData>;
        const data = await userPromise;
        cache.set(cacheKey, data, 18000); //cache for 5 hours
        return data;
      }
    }),
  getServerInfo: publicProcedure
    .input(z.object({ server: z.string() }))
    .query(async ({ input }) => {
      const cacheKey = `discord:${input.server}`;
      const cachedData = cache.get(cacheKey) as UserData | undefined;
      if (cachedData) {
        return cachedData;
      } else {
        const response = await fetch(
          `https://discord.com/api/v10/guilds/${input.server}`,
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

        const userPromise = response.json() as Promise<UserData>;
        const data = await userPromise;
        cache.set(cacheKey, data, 18000); //cache for 5 hours
        return data;
      }
    }),
});
