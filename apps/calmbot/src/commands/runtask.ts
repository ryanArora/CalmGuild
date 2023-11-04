import path from "path";
import fs from "fs";
import { CommandData } from "../client/command";
import { Task } from "../utils/startTasks";

const command: CommandData = {
  run: async (client, message, args) => {
    const dir = path.join(__dirname, `../tasks/`);
    const tasks = fs.readdirSync(dir);

    const taskFile = tasks.find((t) => t.length >= 3 && t.toLowerCase().substring(0, t.length - 3) == args[0].toLowerCase());
    if (!taskFile) {
      message.reply("Couldn't find that task");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const task: Task = require(path.join(dir, taskFile)).default;

    if (task) {
      message.reply("Executing...");
      task.execute(client, new Date());
    }
  },
  minimumArguments: 1,
  usage: "runtask <task-name>",
  requiredPermission: "Administrator",
  aliases: ["rt"],
};

export default command;
