import { EmbedBuilder } from "@discordjs/builders";
import { CommandData } from "../../client/command";
import { client as database } from "database";
const command: CommandData = {
  run: async (client, message) => {
    if (!message.guild) return;

    const completedChallenges = await database.submitedChallenge.findMany({ where: { memberId: message.author.id, guildId: message.guild.id, state: "APPROVED" }, select: { challengeId: true, challenge: { select: { points: true } } } });
    const pointsEarned = completedChallenges.reduce((aggregator, c) => aggregator + c.challenge.points, 0);

    const incompleteChallenges = (await database.challenge.findMany({ where: { guildId: message.guild.id } })).filter((challenge) => !completedChallenges.find((c) => c.challengeId === challenge.id));
    const unearnedPoints = incompleteChallenges.reduce((aggregator, c) => aggregator + c.points, 0);

    const embed = new EmbedBuilder().setDescription(`Challenges for ${message.author}`);
    embed.addFields([
      {
        name: `Completed Challenges (${completedChallenges.length} worth ${pointsEarned} points)`,
        value: !(completedChallenges.length === 0) ? formatChallengeIds(completedChallenges.map((c) => c.challengeId)) : "None",
      },
      {
        name: `Incomplete Challenges (${incompleteChallenges.length} worth ${unearnedPoints} points)`,
        value: !(incompleteChallenges.length === 0) ? formatChallengeIds(incompleteChallenges.map((c) => c.id)) : "None",
      },
    ]);

    message.reply({ embeds: [embed] });
  },
  usage: "challenge check",
};

export default command;

const formatChallengeIds = (ids: string[]) => {
  return ids
    .map((x) => `\`${x}\`,`)
    .join(" ")
    .slice(0, -1);
};
