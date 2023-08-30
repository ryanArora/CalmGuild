import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { RegisteredContextMenuInteraction } from "../../client/interactions";
import checkPermission from "../../utils/checkPermission";
import { editSuggestion, validateSuggestion } from "../../utils/suggestion";

const contextMenu: RegisteredContextMenuInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.isMessageContextMenuCommand()) return;

    if (!checkPermission(interaction.member, "Administrator")) {
      interaction.reply({ content: "You lack `Administrator` permissions.", ephemeral: true });
      return;
    }

    const message = interaction.targetMessage;

    if (!validateSuggestion(client, message)) {
      interaction.reply({ content: "Not a valid suggestion message", ephemeral: true });
      return true;
    }

    await interaction.deferReply({ ephemeral: true });
    editSuggestion(message, interaction.member, "ACCEPT").then(() => interaction.editReply({ content: `Suggestion accepted` }));
  },
  data: new ContextMenuCommandBuilder().setName("Accept Suggestion").setType(ApplicationCommandType.Message),
};

export default contextMenu;
