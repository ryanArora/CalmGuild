import { Client } from "discord.js";
import fs from "fs";
import cron from "node-cron";
import path from "path";
import invariant from "tiny-invariant";

type TaskRunCallback = (client: Client, date: Date) => void;
type TaskValidateCallback = (client: Client, date: Date) => boolean;
export interface Task {
  execute: TaskRunCallback;
  cronExpression: string;
  validate?: TaskValidateCallback;
}

export default (client: Client, tasksDir: string) => {
  const files = fs.readdirSync(tasksDir).filter((file) => fs.statSync(path.join(tasksDir, file)).isFile());
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".js")) continue;
    const name = file.split(".")[0];

    invariant(name, `File at ${path.join(tasksDir, file)} not in proper format`);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const task: Task = require(path.join(tasksDir, file)).default;

    cron.schedule(task.cronExpression, (d) => {
      let date = new Date();
      if (d instanceof Date) date = d;

      if (!task.validate || task.validate(client, date)) task.execute(client, date);
    });
  }
};
