import { RegisteredButtonInteraction } from "../../client/interactions";
import { client as database } from "database";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    await database.member.update({
      where: { openTicketChannelId: interaction.channelId },
      data: { openTicketChannelId: null },
    });
    interaction.channel?.delete();
  },
  validator: (interaction) => interaction.customId.toLowerCase() === "closeticket",
};

export default interaction;
