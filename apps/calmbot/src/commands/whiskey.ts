import { CommandData } from "../client/command";
import { Whiskey } from "../utils/images";

const command: CommandData = {
  run(client, message) {
    const img = Whiskey[Math.floor(Math.random() * Whiskey.length)];
    message.reply({ content: img });
  },
  usage: "whiskey",
};

export default command;
