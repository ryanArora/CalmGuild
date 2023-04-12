import { RegisteredButtonInteraction } from "../../client/interactions";
import { ActionRowBuilder, ModalBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    const modal = new ModalBuilder();
    const textInput = new TextInputBuilder().setLabel("What is your suggestion").setStyle(TextInputStyle.Paragraph).setMaxLength(500).setCustomId("suggestion");

    modal.setTitle("Create Suggestion").addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(textInput)).setCustomId("createSuggestion");

    interaction.showModal(modal);
  },
  validator: (interaction) => interaction.customId.toLowerCase() === "showsuggesitonmodal",
};

export default interaction;
