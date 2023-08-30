import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { RegisteredButtonInteraction } from "../../client/interactions";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild) return;

    const modal = new ModalBuilder().setTitle("Deny Inactive").setCustomId(`denyInactive_${interaction.customId.split("_")[1]}`);
    const textInput = new TextInputBuilder().setLabel("Denial Reason").setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(400).setCustomId("reason");
    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>({
        components: [textInput],
      })
    );

    interaction.showModal(modal);
  },
  validator: (interaction) => interaction.customId.startsWith("showDenyInactiveModal"),
};

export default interaction;
