import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ping the bot for a response.")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Provide the bot a message to respond with.")
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(false)
  );

export default command(meta, ({ interaction }) => {
  const message = interaction.options.getString("message");
  // const bump = new EmbedBuilder()
  //   .setTitle("DISBOARD: The Public Server List")
  //   .setDescription("Bump done! :thumbsup:\nCheck it out")
  //   .setImage("https://disboard.org/images/bot-command-image-bump.png")
  //   .setColor(0x24b7b7);
  // return interaction.reply({
  //   embeds: [bump],
  // });

  return interaction.reply({
    ephemeral: true,
    content: message ?? "Pong! 🏓",
  });
});
