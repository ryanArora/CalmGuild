import { RegisteredModalSubmitInteraction } from "../../client/interactions";
import { client as database } from "database";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, MessageActionRowComponentBuilder, TextChannel } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import getChannel from "../../utils/getChannel";
import getNextDate, { DayOfWeek } from "../../utils/getNextDate";

const interaction: RegisteredModalSubmitInteraction = {
  execute: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const inactiveExpirationDate = Number(interaction.customId.split("_")[1]);

    // Ensure minimum inactive length is one week, (prevent people from clicking older messages and going inactive for like 3 minutes)
    if (getNextDate(new Date(Date.now()), DayOfWeek.Sunday).getTime() >= inactiveExpirationDate) {
      interaction.editReply("This date already passed");
      return;
    }

    const memberData = await database.member.findUnique({ where: { guildId_discordId: { guildId: interaction.guildId, discordId: interaction.user.id } }, select: { inactivityExpires: true } });

    const reason = interaction.fields.getTextInputValue("reason");
    const embed = new EmbedBuilder()
      .setTitle("Inactivity Request")
      .setColor(Colors.DarkBlue)
      .addFields([
        { name: "Request from:", value: interaction.user.toString() },
        { name: "Reason:", value: reason },
        { name: "Last Inactive Expired:", value: `${memberData?.inactivityExpires ? `<t:${Math.floor(Number(memberData?.inactivityExpires) / 1000)}:R>` : "N/A"}`, inline: true },
        { name: "Inactive Until:", value: `<t:${Math.floor(inactiveExpirationDate / 1000)}:R>`, inline: true },
      ]);

    const acceptButton = new ButtonBuilder().setLabel("Accept").setStyle(ButtonStyle.Success).setCustomId(`acceptInactive_${interaction.user.id}_${inactiveExpirationDate}`);
    const denyButton = new ButtonBuilder().setLabel("Deny").setStyle(ButtonStyle.Danger).setCustomId(`showDenyInactiveModal_${interaction.user.id}`);
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(acceptButton, denyButton);

    const inactiveRequestChannel = await getChannel("INACTIVITY_REQUESTS", interaction.guild);

    if (!inactiveRequestChannel || !(inactiveRequestChannel instanceof TextChannel)) {
      interaction.editReply("Couldn't send request");
      return;
    }

    await inactiveRequestChannel.send({ embeds: [embed], components: [row] });
    await database.member.update({ where: { guildId_discordId: { guildId: interaction.guildId, discordId: interaction.user.id } }, data: { inactivePending: true } });

    interaction.editReply("Submited. You will be informed when it is accepted/denied");
  },
  validator: (interaction) => interaction.customId.startsWith("submitInactiveRequest"),
};

export default interaction;
