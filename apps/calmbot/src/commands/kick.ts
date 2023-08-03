import { CommandData } from "discord.js";
import { sendCommand } from "../utils/apis/minecraftBot";

const command: CommandData = {
  run: (client, message, args) => {
    const ign = args[0].toLowerCase();
    const reason = args.slice(1).join(" ");

    const command = `/guild kick ${ign} ${reason}`;
    if (command.length > 256) {
      message.reply("Command in excess of maximum character limit (256). Please shorten the reason.");
      return;
    }

    sendCommand(command)
      .then(() => {
        message.reply("Sent command!");
      })
      .catch((err) => {
        message.reply("Error sending command");
        console.error(err);
      });
  },
  usage: "kick <ign> <reason>",
  minimumArguments: 2,
  requiredPermission: "STAFF",
};

export default command;
