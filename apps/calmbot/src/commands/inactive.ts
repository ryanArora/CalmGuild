import { CommandData } from "../client/command";
import generateInactivityMessage from "../utils/generateInactivityMessage";

const command: CommandData = {
  run: (client, message) => message.reply(generateInactivityMessage()),
  usage: "inactive",
};

export default command;
