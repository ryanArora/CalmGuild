import { CommandData } from "discord.js";
import { sendCommand } from "../utils/apis/minecraftBot";

const command: CommandData = {
  run: (client, message, args) => {
    const ign = args[0].toLowerCase();
    sendCommand(`/guild invite ${ign}`)
      .then(() => {
        message.reply("Sent command!");
      })
      .catch((err) => {
        message.reply("Error sending command");
        console.error(err);
      });
  },
  usage: "invite <ign>",
  minimumArguments: 1,
  requiredPermission: "STAFF",
};

export default command;
