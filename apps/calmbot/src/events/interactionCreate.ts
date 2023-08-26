import { Event } from "../client/events";
import { Client, Interaction } from "discord.js";
import { BaseRegisteredInteraction } from "../client/interactions";
import { client as database } from "database";
import findOrCreateMemberArgs from "../utils/database/findOrCreateMemberArgs";
const interactionEvent: Event = {
  execute: (client, interaction: Interaction) => {
    if (interaction.isButton()) {
      execute(
        client,
        interaction,
        client.buttons.find((i) => i.validator(interaction))
      );
    } else if (interaction.isStringSelectMenu()) {
      execute(
        client,
        interaction,
        client.selectMenus.find((i) => i.validator(interaction))
      );
    } else if (interaction.isModalSubmit()) {
      execute(
        client,
        interaction,
        client.modals.find((i) => i.validator(interaction))
      );
    } else if (interaction.isContextMenuCommand()) {
      execute(
        client,
        interaction,
        client.contextMenus.find((i) => i.data.name === interaction.commandName)
      );
    }
  },
  type: "interactionCreate",
};

export default interactionEvent;

const execute = async (client: Client, interaction: Interaction, interactionData?: BaseRegisteredInteraction<unknown>) => {
  if (!interactionData || !interaction.guild) return;

  if (interactionData.ensureMemberDataExists) {
    await database.user.upsert({ ...findOrCreateMemberArgs(interaction.user.id, interaction.guild.id) });
  }

  interactionData.execute(client, interaction);
};
