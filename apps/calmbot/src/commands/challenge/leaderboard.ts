import { EmbedBuilder } from "@discordjs/builders";
import { CommandData } from "../../client/command";
import { client as database } from "database";
import { Colors } from "discord.js";
const command: CommandData = {
  run: async (client, message) => {
    if (!message.guild) return;

    const members = await database.member.findMany({
      where: { submitedChallenges: { some: { state: "APPROVED" } } },
      select: { discordId: true, submitedChallenges: { where: { state: "APPROVED" }, select: { challenge: { select: { points: true } } } } },
      distinct: ["discordId"],
    });

    if (members.length === 0) {
      message.reply("No members currently have any completed challenges");
      return;
    }

    const leaderboard = [...members].sort((a, b) => getPoints(b) - getPoints(a));
    leaderboard.splice(10);

    const embed = new EmbedBuilder().setTitle("Challenge Leaderboard").setColor(Colors.Blue);

    let i = 1;
    embed.setDescription(
      leaderboard
        .map((member) => {
          const entry = `${i}. <@${member.discordId}> - ${getPoints(member)}`;
          i++;
          return entry;
        })
        .join("\n")
    );

    message.reply({ embeds: [embed] });
  },
  usage: "challenge leaderboard",
  requiredPermission: "STAFF",
};

const getPoints = (member: { submitedChallenges: { challenge: { points: number } }[] }) => member.submitedChallenges.reduce((agg, c) => agg + c.challenge.points, 0);

export default command;
