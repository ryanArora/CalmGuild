import { CommandData } from "../client/command";

const command: CommandData = {
  run: (client, message) => {
    message.reply(":coin:").then((m) => {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        m.edit(`It's ${Math.random() >= 0.5 ? "Heads" : "Tails"}`).catch(() => {});
      }, 1500);
    });
  },
  aliases: ["cf"],
  usage: "coinflip",
};

export default command;
