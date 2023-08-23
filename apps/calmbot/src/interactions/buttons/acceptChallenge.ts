import { RegisteredButtonInteraction } from "../../client/interactions";
import { client as database } from "database";
import disableButtons from "../../utils/disableButtons";
import { Colors, TextChannel } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import getChannel from "../../utils/getChannel";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    const guild = interaction.guild;

    const interactionArgs = interaction.customId.split("_");
    if (interactionArgs.length < 3) return interaction.reply("Error");

    const memberId = interactionArgs[1];
    const challengeId = interactionArgs[2];

    const submitedChallenge = await database.submitedChallenge.update({ where: { memberId_challengeId: { memberId, challengeId } }, data: { state: "APPROVED" }, select: { challenge: { select: { displayName: true } } } });

    await disableButtons(interaction.message);
    interaction.reply(`Challenge accepted by ${interaction.user}`);

    client.users
      .fetch(memberId)
      .then((user) => {
        const embed = new EmbedBuilder()
          .setColor(Colors.Green)
          .setTitle("Challenge Request Accepted")
          .setDescription(`**Challenge Name:** ${submitedChallenge.challenge.displayName}\n**Challenge ID:** ${challengeId}`)
          .setFooter({ text: "Run c!challenge check to view your progress so far" });

        user.send({ embeds: [embed] }).catch(async () => {
          const channel = await getChannel("CHALLENGE_PROOF", guild);
          if (channel instanceof TextChannel) {
            channel.send({ content: interaction.user.toString(), embeds: [embed] });
          }
        });
      })
      .catch();
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("acceptchallenge"),
};

export default interaction;
