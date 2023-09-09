import { RegisteredButtonInteraction } from "../../client/interactions";
import { client as database } from "database";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    const memberId = interaction.customId.split("_")[1];
    if (!memberId) return interaction.reply("Error");

    await database.member.update({
      where: { guildId_discordId: { discordId: memberId, guildId: interaction.guildId } },
      data: { guildApplicationChannelId: null },
    });

    interaction.channel?.delete();
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("cancelapplication"),
};

export default interaction;
