import { RegisteredModalSubmitInteraction } from "../../client/interactions";
import { client as database } from "database";
import { Colors, EmbedBuilder, escapeMarkdown } from "discord.js";
import getChannel from "../../utils/getChannel";
import { getProfileFromUUID } from "../../utils/apis/mojang";

const interaction: RegisteredModalSubmitInteraction = {
  execute: async (client, interaction) => {
    const memberId = interaction.customId.split("_")[1];
    if (!memberId) return interaction.reply("Error");

    const member = await database.member.update({
      where: { guildId_discordId: { discordId: memberId, guildId: interaction.guildId } },
      data: { guildApplicationChannelId: null },
      select: { user: { select: { minecraftUuid: true } } },
    });

    await interaction.reply({ content: "Denied", ephemeral: true });
    await interaction.channel?.delete();

    const reason = interaction.fields.getTextInputValue("reason") ?? "N/A";

    client.users
      .fetch(memberId)
      .then((user) => {
        const embed = new EmbedBuilder();
        embed.setTitle("Application to calm denied");
        embed.setDescription(`Sorry! Your application to calm has been denied for the following reason:\n\n${reason}`);
        embed.setColor(Colors.Red);

        user.send({ embeds: [embed] });
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});

    const channel = await getChannel("APPLICATIONS_LOG", interaction.guild);
    if (!channel?.isTextBased()) return;

    let ign = "Couldn't get IGN";
    if (member.user.minecraftUuid) {
      ign = (await getProfileFromUUID(member.user.minecraftUuid))?.name ?? ign;
    }

    const logEmbed = new EmbedBuilder()
      .setTitle("Denied")
      .setColor(Colors.Red)
      .addFields([
        { name: "Applicant", value: `<@${memberId}> (${memberId})\n${escapeMarkdown(ign)} (${member.user.minecraftUuid})` },
        { name: "Staff Member", value: `${interaction.user} (${interaction.user.id})` },
        { name: "Reason", value: reason },
      ]);

    channel.send({ embeds: [logEmbed] });
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("denyapplication"),
};

export default interaction;
