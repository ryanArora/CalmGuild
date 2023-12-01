import { CommandData } from "../client/command";
import { Aida, imagesCommandExecutor } from "../utils/images";

const command: CommandData = {
  run: imagesCommandExecutor(Aida),
  usage: "aida",
};

export default command;
