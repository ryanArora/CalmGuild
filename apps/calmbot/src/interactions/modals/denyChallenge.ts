import { RegisteredModalSubmitInteraction } from "../../client/interactions";
import { client as database } from "database";
import { Colors, EmbedBuilder, TextChannel } from "discord.js";
import getChannel from "../../utils/getChannel";

const interaction: RegisteredModalSubmitInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild) return;
    await interaction.deferReply();
    const guild = interaction.guild;

    const interactionArgs = interaction.customId.split("_");
    if (interactionArgs.length < 3) return interaction.editReply("Error");

    const submitedChallenge = await database.submitedChallenge.delete({
      where: { memberId_challengeId: { memberId: interactionArgs[1], challengeId: interactionArgs[2] } },
      select: { challenge: { select: { displayName: true } } },
    });

    const reason = interaction.fields.getTextInputValue("reason");
    client.users
      .fetch(interactionArgs[1])
      .then((user) => {
        const embed = new EmbedBuilder()
          .setColor(Colors.DarkRed)
          .setTitle("Challenge Request Denied")
          .setDescription(`**Challenge Name:** ${submitedChallenge.challenge.displayName}\n**Challenge ID:** ${interactionArgs[2]}\n\n**Reason:** ${reason}`)
          .setFooter({ text: "Run c!challenge check to view your progress so far" });

        user.send({ embeds: [embed] }).catch(async () => {
          const channel = await getChannel("CHALLENGE_PROOF", guild);
          if (channel instanceof TextChannel) {
            channel.send({ content: interaction.user.toString(), embeds: [embed] });
          }
        });

        interaction.editReply(`Denied by ${interaction.user}`);
      })
      .catch();
  },
  validator: (interaction) => interaction.customId.toLowerCase().startsWith("denychallenge"),
};

export default interaction;
