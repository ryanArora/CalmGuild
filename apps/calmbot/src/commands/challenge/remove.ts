import { CommandData } from "../../client/command";
import { client as database } from "database";
const command: CommandData = {
  run: async (client, message, args) => {
    const id = args[0].toLowerCase() ?? "";
    await database.challenge.delete({ where: { id_guildId: { id, guildId: message.guildId } } });
    message.reply("Deleted");
  },
  usage: "challenge remove <id>",
  minimumArguments: 1,
  requiredPermission: "STAFF",
};

export default command;
