import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import { RegisteredModalSubmitInteraction } from "../../client/interactions";
import getChannel from "../../utils/getChannel";

const interaction: RegisteredModalSubmitInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    const suggestionChannel = await getChannel("SUGGESTIONS", interaction.guild);

    if (suggestionChannel === undefined || !(suggestionChannel instanceof TextChannel)) {
      return interaction.reply({ content: "No suggestion channel found", ephemeral: true });
    }

    const member = interaction.member;

    const suggestion = interaction.fields.getTextInputValue("suggestion");
    const embed = new EmbedBuilder().setTitle("Suggestion:").setDescription(suggestion).setTimestamp().setColor("#007FFF");
    if (member instanceof GuildMember) embed.setFooter({ text: member.displayName, iconURL: member.user.displayAvatarURL() });

    suggestionChannel.send({ embeds: [embed] }).then((message) => {
      message.react("✅");
      message.react("❎");

      interaction.reply({ content: "Suggestion created", ephemeral: true });
    });
  },
  validator: (interaction) => interaction.customId.toLowerCase() === "createsuggestion",
};

export default interaction;
