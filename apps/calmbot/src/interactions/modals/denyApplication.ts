import { RegisteredModalSubmitInteraction } from "../../client/interactions";
import { client as database } from "database";
import { Colors, EmbedBuilder } from "discord.js";

const interaction: RegisteredModalSubmitInteraction = {
  execute: async (client, interaction) => {
    const memberId = interaction.customId.split("_")[1];
    if (!memberId) return interaction.reply("Error");

    await database.user.update({
      where: { discordId: memberId },
      data: { guildApplicationChannelId: null },
    });

    await interaction.reply({ content: "Denied", ephemeral: true });
    await interaction.channel?.delete();

    client.users
      .fetch(memberId)
      .then((user) => {
        const embed = new EmbedBuilder();
        embed.setTitle("Application to calm denied");
        embed.setDescription(`Sorry! Your application to calm has been denied for the following reason:\n\n${interaction.fields.getTextInputValue("reason") ?? "N/A"}`);
        embed.setColor(Colors.Red);

        user.send({ embeds: [embed] });
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("denyapplication"),
};

export default interaction;
