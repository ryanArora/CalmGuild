import { CommandData } from "../../client/command";
import { client as database } from "database";
const command: CommandData = {
  run: async (client, message, args) => {
    if (!message.guild) return;

    const id = args[0].toLowerCase() ?? "";
    await database.challenge.delete({ where: { id_guildId: { id, guildId: message.guild.id } } });
    message.reply("Deleted");
  },
  usage: "challenge remove <id>",
  minimumArguments: 1,
  requiredPermission: "STAFF",
};

export default command;
