import { Client, Collection } from "discord.js";
import fs from "fs";
import cron from "node-cron";
import path from "path";
import invariant from "tiny-invariant";

type TaskRunCallback = (client: Client, date: Date) => void;
type TaskValidateCallback = (client: Client, date: Date) => boolean;
export interface Task {
  execute: TaskRunCallback;
  validate?: TaskValidateCallback;
}

const tasks: Collection<string, Task> = new Collection();

export default (client: Client, tasksDir: string) => {
  const files = fs.readdirSync(tasksDir).filter((file) => fs.statSync(path.join(tasksDir, file)).isFile());
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".js")) continue;
    const name = file.split(".")[0];

    invariant(name, `File at ${path.join(tasksDir, file)} not in proper format`);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const task: Task = require(path.join(tasksDir, file)).default;

    tasks.set(name, task);
  }

  cron.schedule("* * * * *", (d) => {
    for (const [, task] of tasks) {
      let date = new Date();
      if (d instanceof Date) date = d;

      const shouldRun = task.validate ? task.validate(client, date) : true;
      if (shouldRun) task.execute(client, date);
    }
  });
};
