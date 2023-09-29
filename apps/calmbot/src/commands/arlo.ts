import { CommandData } from "../client/command";
import { Arlo } from "../utils/images";

const command: CommandData = {
  run(client, message) {
    const img = Arlo[Math.floor(Math.random() * Arlo.length)];
    message.reply({ content: img });
  },
  usage: "arlo",
};

export default command;
