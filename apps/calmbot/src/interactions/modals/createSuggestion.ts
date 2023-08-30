import { TextChannel } from "discord.js";
import { RegisteredModalSubmitInteraction } from "../../client/interactions";
import getChannel from "../../utils/getChannel";
import { getSuggestionMessage } from "../../utils/suggestion";

const interaction: RegisteredModalSubmitInteraction = {
  execute: async (client, interaction) => {
    const suggestionChannel = await getChannel("SUGGESTIONS", interaction.guild);

    if (suggestionChannel === undefined || !(suggestionChannel instanceof TextChannel)) {
      return interaction.reply({ content: "No suggestion channel found", ephemeral: true });
    }

    const member = interaction.member;

    const message = getSuggestionMessage(interaction.fields.getTextInputValue("suggestion"), member);
    suggestionChannel.send(message).then((message) => {
      message.react("✅");
      message.react("❎");

      interaction.reply({ content: "Suggestion created", ephemeral: true });
    });
  },
  validator: (interaction) => interaction.customId.toLowerCase() === "createsuggestion",
};

export default interaction;
