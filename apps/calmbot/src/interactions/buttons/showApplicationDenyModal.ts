import { RegisteredButtonInteraction } from "../../client/interactions";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, ModalActionRowComponentBuilder, TextInputStyle } from "discord.js";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    const memberId = interaction.customId.split("_")[1];
    if (!memberId) return interaction.reply("Error");

    const modal = new ModalBuilder().setTitle("Deny Application").setCustomId(`denyApplication_${memberId}`);
    const textInput = new TextInputBuilder().setLabel("Denial Reason").setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(400).setCustomId("reason");
    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>({
        components: [textInput],
      })
    );

    interaction.showModal(modal);
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("showapplicationdenymodal"),
};

export default interaction;
