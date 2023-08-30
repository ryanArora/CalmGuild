import { RegisteredButtonInteraction } from "../../client/interactions";
import { client as database } from "database";
import disableButtons from "../../utils/disableButtons";
import { Colors } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import sendDmOrChannel from "../../utils/sendDmOrChannel";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    const interactionArgs = interaction.customId.split("_");
    if (interactionArgs.length < 3) return interaction.reply("Error");

    const memberId = interactionArgs[1];
    const challengeId = interactionArgs[2];

    const submitedChallenge = await database.submitedChallenge.update({ where: { memberId_challengeId: { memberId, challengeId } }, data: { state: "APPROVED" }, select: { challenge: { select: { displayName: true } } } });

    await disableButtons(interaction.message);

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("Challenge Request Accepted")
      .setDescription(`**Challenge Name:** ${submitedChallenge.challenge.displayName}\n**Challenge ID:** ${challengeId}`)
      .setFooter({ text: "Run c!challenge check to view your progress so far" });

    sendDmOrChannel(client, memberId, interaction.guild, { content: `<@${memberId}>`, embeds: [embed] }, "CHALLENGE_PROOF");
    interaction.reply(`Challenge accepted by ${interaction.user}`);
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("acceptchallenge"),
};

export default interaction;
