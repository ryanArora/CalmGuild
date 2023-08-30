import { RegisteredButtonInteraction } from "../../client/interactions";
import getRole from "../../utils/getRole";
import { client as database } from "database";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    const memberId = interaction.customId.split("_")[1];
    if (!memberId) return interaction.reply("Error");

    await database.member.update({
      where: { guildId_discordId: { discordId: memberId, guildId: interaction.guildId } },
      data: { guildApplicationChannelId: null },
    });
    await interaction.channel?.delete();

    const waitlistRole = await getRole("WAITLIST", interaction.guild);
    if (!waitlistRole) return;

    interaction.guild.members.fetch(memberId).then((member) => {
      member.roles.add(waitlistRole);
    });
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("acceptapplication"),
};

export default interaction;
