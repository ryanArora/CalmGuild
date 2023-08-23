import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { RegisteredButtonInteraction } from "../../client/interactions";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild) return;

    const interactionArgs = interaction.customId.split("_");
    if (interactionArgs.length < 3) return interaction.reply("Error");

    const modal = new ModalBuilder().setTitle("Deny Challenge").setCustomId(`denyChallenge_${interactionArgs[1]}_${interactionArgs[2]}`);
    const textInput = new TextInputBuilder().setLabel("Denial Reason").setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(400).setCustomId("reason");
    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>({
        components: [textInput],
      })
    );

    interaction.showModal(modal);
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("showchallengedenymodal"),
};

export default interaction;
