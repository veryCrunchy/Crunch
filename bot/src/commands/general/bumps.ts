import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { command, findDiscordBump } from "../../utils";
import keys from "../../keys/";

const meta = new SlashCommandBuilder()
  .setName("bumps")
  .setDescription("Get a url to the disboard bump leaderboard.");

// .addSubcommand((subcommand) =>
//   subcommand
//     .setName("toggle")
//     .setDescription("This will turn the bump leaderboard on/off.")
//     .addBooleanOption((option) =>
//       option
//         .setName("enabled")
//         .setDescription("Whether bump counts should be enabled or not.")
//     )
// )

export default command(meta, async ({ interaction }) => {
  let user = `${interaction.user?.id}`;
  let guild = `${interaction.guild?.id}`;
  let bump = await findDiscordBump(user, guild);
  if (bump) {
    let times = "times";
    if (bump.bumps == 1) times = "time";
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Click to view bump leaderboard")
          .setURL(`https://verycrunchy.dev/bump/${interaction.guild?.id}`)
          .setDescription(
            `You bumped this server \`${bump.bumps}\` ${times} this month!`
          )
          .setColor(keys.color.primary),
      ],
      ephemeral: true,
    });
  } else {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Click to view bump leaderboard")
          .setURL(`https://verycrunchy.dev/bump/${interaction.guild?.id}`)
          .setDescription(
            `You haven't given this server a </bump:947088344167366698> this month.`
          )
          .setColor(keys.color.secondary),
      ],
      ephemeral: true,
    });
  }
});
