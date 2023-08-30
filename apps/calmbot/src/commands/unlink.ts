import getUserFromInput from "../utils/getUserFromInput";
import { client as database } from "database";
import { CommandData } from "discord.js";

const command: CommandData = {
  run: async (client, message, args) => {
    if (!args[0]) return;

    const user = await getUserFromInput(client, args[0]);
    if (!user) {
      message.reply("Couldn't find user");
      return;
    }

    const userData = await database.user.findFirst({
      where: { discordId: user.id },
      select: { minecraftUuid: true },
    });

    if (userData?.minecraftUuid == null) {
      message.reply("This user is not linked");
      return;
    }

    await database.user.update({ where: { discordId: user.id }, data: { minecraftUuid: null } });
    message.reply("Unlinked.");
  },
  requiredPermission: "STAFF",
  minimumArguments: 1,
  usage: "unlink <person>",
};

export default command;
