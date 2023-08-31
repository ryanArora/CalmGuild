import { RegisteredButtonInteraction } from "../../client/interactions";
import { client as database } from "database";
import { ActionRowBuilder, ModalBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    const databaseUser = await database.member.findUnique({
      where: { guildId_discordId: { discordId: interaction.user.id, guildId: interaction.guildId } },
    });

    // Make sure user doesn't already have a ticket open
    if (databaseUser && databaseUser.openTicketChannelId) {
      const channel = interaction.guild.channels.cache.get(databaseUser.openTicketChannelId);

      if (channel)
        return interaction.reply({
          content: `Already have a ticket open ${channel}`,
          ephemeral: true,
        });

      await database.member.update({
        where: { guildId_discordId: { discordId: databaseUser.discordId, guildId: interaction.guildId } },
        data: { openTicketChannelId: null },
      });
    }

    const modal = new ModalBuilder();
    const textInput = new TextInputBuilder().setLabel("How can we help you?").setStyle(TextInputStyle.Paragraph).setMaxLength(400).setCustomId("reason");

    modal.setTitle("Create Ticket").addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(textInput)).setCustomId("createTicket");

    interaction.showModal(modal);
  },
  validator: (interaction) => interaction.customId.toLowerCase() === "showticketmodal",
};

export default interaction;
