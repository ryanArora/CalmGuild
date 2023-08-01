import { Event } from "../client/events";
import { Interaction } from "discord.js";

const interactionEvent: Event = {
  execute: (client, interaction: Interaction) => {
    if (interaction.isButton()) {
      client.buttons.find((i) => i.validator(interaction))?.execute(client, interaction);
    } else if (interaction.isStringSelectMenu()) {
      client.selectMenus.find((i) => i.validator(interaction))?.execute(client, interaction);
    } else if (interaction.isModalSubmit()) {
      client.modals.find((i) => i.validator(interaction))?.execute(client, interaction);
    }
  },
  type: "interactionCreate",
};

export default interactionEvent;
