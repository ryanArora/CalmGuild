import { RegisteredButtonInteraction } from "../../client/interactions";
import { client as database } from "database";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild) return;

    const memberId = interaction.customId.split("_")[1];
    if (!memberId) return interaction.reply("Error");

    if (interaction.user.id !== memberId)
      return interaction.reply({
        content: "Only the creator of the application can do this",
        ephemeral: true,
      });

    await database.member.update({
      where: { guildId_discordId: { discordId: memberId, guildId: interaction.guild.id } },
      data: { guildApplicationChannelId: null },
    });

    interaction.channel?.delete();
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("cancelapplication"),
};

export default interaction;
