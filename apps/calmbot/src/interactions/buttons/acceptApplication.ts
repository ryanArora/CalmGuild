import { Colors, EmbedBuilder, escapeMarkdown } from "discord.js";
import { RegisteredButtonInteraction } from "../../client/interactions";
import getChannel from "../../utils/getChannel";
import getRole from "../../utils/getRole";
import { client as database } from "database";
import { getProfileFromUUID } from "../../utils/apis/mojang";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    const memberId = interaction.customId.split("_")[1];
    if (!memberId) return interaction.reply("Error");

    const member = await database.member.update({
      where: { guildId_discordId: { discordId: memberId, guildId: interaction.guildId } },
      data: { guildApplicationChannelId: null },
      select: { user: { select: { minecraftUuid: true } } },
    });
    await interaction.channel?.delete();

    const waitlistRole = await getRole("WAITLIST", interaction.guild);
    if (!waitlistRole) return;

    interaction.guild.members.fetch(memberId).then((member) => {
      member.roles.add(waitlistRole);
    });

    const channel = await getChannel("APPLICATIONS_LOG", interaction.guild);
    if (!channel?.isTextBased()) return;

    let ign = "Couldn't get IGN";
    if (member.user.minecraftUuid) {
      ign = (await getProfileFromUUID(member.user.minecraftUuid))?.name ?? ign;
    }

    const logEmbed = new EmbedBuilder()
      .setTitle("Application accepted")
      .setColor(Colors.Green)
      .addFields([
        { name: "Applicant", value: `<@${memberId}> (${memberId})\n${escapeMarkdown(ign)} (${member.user.minecraftUuid})` },
        { name: "Staff Member", value: `${interaction.user} (${interaction.user.id})` },
      ]);

    channel.send({ embeds: [logEmbed] });
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("acceptapplication"),
};

export default interaction;
