import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { RegisteredContextMenuInteraction } from "../../client/interactions";
import checkPermission from "../../utils/checkPermission";
import generateUserInfoEmbed from "../../utils/generateUserInfoEmbed";

const contextMenu: RegisteredContextMenuInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.isUserContextMenuCommand()) return;

    if (!checkPermission(interaction.member, "STAFF")) {
      interaction.reply({ content: "You lack `Staff` permissions.", ephemeral: true });
      return;
    }

    const embed = await generateUserInfoEmbed(interaction.targetUser.id);
    interaction.reply({ ephemeral: true, embeds: [embed] });
  },
  data: new ContextMenuCommandBuilder().setName("User Info").setType(ApplicationCommandType.User),
};

export default contextMenu;
