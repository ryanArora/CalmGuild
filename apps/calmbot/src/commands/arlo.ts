import { CommandData } from "../client/command";
import { Arlo, imagesCommandExecutor } from "../utils/images";

const command: CommandData = {
  run: imagesCommandExecutor(Arlo),
  usage: "arlo",
};

export default command;
