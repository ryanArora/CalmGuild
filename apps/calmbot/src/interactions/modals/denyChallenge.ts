import { RegisteredModalSubmitInteraction } from "../../client/interactions";
import { client as database } from "database";
import { Colors, EmbedBuilder } from "discord.js";
import sendDmOrChannel from "../../utils/sendDmOrChannel";
import disableButtons from "../../utils/disableButtons";

const interaction: RegisteredModalSubmitInteraction = {
  execute: async (client, interaction) => {
    await interaction.deferReply();

    const interactionArgs = interaction.customId.split("_");
    if (interactionArgs.length < 3) return interaction.editReply("Error");

    const submitedChallenge = await database.submitedChallenge.delete({
      where: { memberId_challengeId: { memberId: interactionArgs[1], challengeId: interactionArgs[2] } },
      select: { challenge: { select: { displayName: true } } },
    });

    const reason = interaction.fields.getTextInputValue("reason");

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("Challenge Request Denied")
      .setDescription(`**Challenge Name:** ${submitedChallenge.challenge.displayName}\n**Challenge ID:** ${interactionArgs[2]}\n\n**Reason:** ${reason}`)
      .setFooter({ text: "Run c!challenge check to view your progress so far" });

    sendDmOrChannel(client, interactionArgs[1], interaction.guild, { content: `<@${interactionArgs[1]}>`, embeds: [embed] }, "CHALLENGE_PROOF");
    interaction.editReply(`Denied by ${interaction.user}`);
    if (interaction.isFromMessage()) disableButtons(interaction.message);
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("denychallenge"),
};

export default interaction;
