import { RegisteredModalSubmitInteraction } from "../../client/interactions";
import { client as database } from "database";
import { Colors, EmbedBuilder, escapeMarkdown } from "discord.js";
import sendDmOrChannel from "../../utils/sendDmOrChannel";
import disableButtons from "../../utils/disableButtons";

const interaction: RegisteredModalSubmitInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    await interaction.deferReply();
    const guild = interaction.guild;

    const discordId = interaction.customId.split("_")[1];

    await database.member.update({ where: { guildId_discordId: { guildId: guild.id, discordId } }, data: { inactivePending: false } });

    const reason = interaction.fields.getTextInputValue("reason");

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle("Inactivity Request Denied")
      .setDescription(`Sorry. Your inactiviy request has been denied due to:\n\n${escapeMarkdown(reason)}`)
      .setFooter({ text: "Feel free to always submit another request or contact staff if you believe this was a mistake" });

    sendDmOrChannel(client, discordId, guild, { content: `<@${discordId}>`, embeds: [embed] }, "GUILD_ONLY");
    interaction.editReply(`Inactivity denied by ${interaction.user}`);
    if (interaction.isFromMessage()) disableButtons(interaction.message);
  },
  validator: (interaction) => interaction.customId.startsWith("denyInactive"),
};

export default interaction;
