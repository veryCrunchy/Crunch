import keys from "../../keys";
import {
  event,
  prisma,
  createDiscordBump,
  createDiscordServerMember,
  findDiscordBump,
  findDiscordServerMember,
} from "../../utils";
import { EmbedBuilder } from "discord.js";
export default event("messageCreate", async ({ log }, message) => {
  if (message.author.id !== "302050872383242240") return;

  let msg = message.embeds[0];
  if (!msg?.data?.description?.toLowerCase()?.includes("bump done")) return;

  let user = `${message.interaction?.user.id}`;
  let guild = `${message.guild?.id}`;

  const server = await prisma.discordServer.findFirst({
    where: {
      sid: guild,
    },
    include: {
      settings: {
        select: {
          bumps: true,
        },
      },
    },
  });

  if (!server)
    return await prisma.discordServer
      .create({
        data: {
          sid: guild,

          settings: {
            create: {},
          },
        },
      })
      .then(() => {
        createUser(guild, user);
      });

  if (!server?.settings?.bumps) return;

  let bumps = await findDiscordBump(user, guild);
  if (!bumps) {
    let member = await findDiscordServerMember(user, guild);
    //if member doesn't exist, create new member and bump
    if (!member) return createUser(guild, user);

    await createDiscordBump(member.id, member.uid, member.sid);
    return bumpMessage();
  }

  let check = await prisma.discordBumps.findFirst({
    where: {
      uid: user,
      sid: guild,
      month: new Date().getMonth() + 1,
    },
  });
  let date = new Date();
  if (
    check?.updatedAt.getFullYear() == date.getFullYear() &&
    check?.updatedAt.getMonth() + 1 == check?.month
  )
    return prisma.discordBumps
      .update({
        where: {
          uid_sid_month: {
            uid: user,
            sid: guild,
            month: new Date().getMonth() + 1,
          },
        },
        data: {
          bumps: {
            increment: 1,
          },
        },
      })
      .then((d) => {
        bumpMessage(d.bumps);
      });

  // reset after year
  return prisma.discordBumps
    .update({
      where: {
        uid_sid_month: {
          uid: user,
          sid: guild,
          month: new Date().getMonth() + 1,
        },
      },
      data: {
        bumps: 1,
      },
    })
    .then((d) => {
      bumpMessage(d.bumps);
    });

  async function createUser(guild: string, user: string) {
    let data = await createDiscordServerMember(guild, user);
    await createDiscordBump(data.id, data.uid, data.sid);
    bumpMessage();
  }
  function bumpMessage(bumps: number = 1) {
    const url = `https://verycrunchy.dev/bump/${message.guild?.id}`;
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Bump Leaderboard")
          .setURL(url)
          .setDescription(
            `This is your [\`${ordinal(
              bumps
            )}\`](${url}) </bump:947088344167366698> this month!`
          )
          .setFooter({
            text: message.interaction?.user?.username ?? "Unknown",
            iconURL: `https://cdn.discordapp.com/avatars/${message.interaction?.user?.id}/${message.interaction?.user?.avatar}.webp?size=80`,
          })
          .setColor(keys.color.primary),
      ],
    });
  }
});

function ordinal(i: number) {
  const j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return String(i) + "st";
  }
  if (j == 2 && k != 12) {
    return String(i) + "nd";
  }
  if (j == 3 && k != 13) {
    return String(i) + "rd";
  }
  return String(i) + "th";
}
