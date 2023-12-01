import { CommandData } from "../client/command";
import { Whiskey, imagesCommandExecutor } from "../utils/images";

const command: CommandData = {
  run: imagesCommandExecutor(Whiskey),
  usage: "whiskey",
};

export default command;
