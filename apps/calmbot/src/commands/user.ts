import generateUserInfoEmbed from "../utils/generateUserInfoEmbed";
import getUserFromInput from "../utils/getUserFromInput";
import { CommandData } from "discord.js";

const command: CommandData = {
  run: async (client, message, args) => {
    if (!args[0]) return;
    const user = await getUserFromInput(client, args[0]);
    if (!user) {
      message.reply("Couldn't find user");
      return;
    }

    const embed = await generateUserInfoEmbed(user.id);

    message.reply({ embeds: [embed] });
  },
  requiredPermission: "STAFF",
  minimumArguments: 1,
  usage: "user <person>",
};

export default command;
