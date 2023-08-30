import { AttachmentBuilder } from "discord.js";
import { CommandData } from "../../client/command";
import { client as database } from "database";
const command: CommandData = {
  run: async (client, message) => {
    const data = await database.challenge.findMany({ include: { submitedChallenges: true } });
    await database.challenge.deleteMany();

    message.reply({ content: "Cleared challenge data. Exported data to a file just in case.", files: [new AttachmentBuilder(Buffer.from(JSON.stringify(data)), { name: "data.json" })] });
  },
  usage: "challenge clear",
  requiredPermission: "Administrator",
};

export default command;
