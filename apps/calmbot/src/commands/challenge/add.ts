import { CommandData } from "../../client/command";
import { client as database } from "database";
const command: CommandData = {
  run: async (client, message, args) => {
    const id = args.shift()?.toLowerCase() ?? "";
    const points = Number(args.shift());
    const challengeDescription = args.join(" ");

    if (id.length > 5) {
      message.reply("Challenge id too large");
      return;
    }

    if (isNaN(points)) {
      message.reply("Invalid number input for point value");
      return;
    }

    const existingChallenge = await database.challenge.findUnique({ where: { id_guildId: { id, guildId: message.guildId } } });
    if (existingChallenge) {
      message.reply("Challenge with that id already exists.");
      return;
    }

    database.challenge
      .create({ data: { id, points, displayName: challengeDescription, guildId: message.guildId } })
      .then(() => message.reply("Done"))
      .catch(console.error);
  },
  usage: "challenge add <id> <points> <challenge description>",
  minimumArguments: 3,
  requiredPermission: "STAFF",
};

export default command;
