import { CommandData } from "../client/command";
import { client as database } from "database";

const command: CommandData = {
  run: async (client, message, args) => {
    const commandName = args[0].toLowerCase();
    if (!client.commands.has(commandName) || commandName === "togglecommand") {
      message.reply("Couldn't find this command");
      return;
    }

    const alreadyDisabled = client.disabledCommands.get(message.guildId)?.includes(commandName);
    if (!alreadyDisabled) {
      await database.guild.update({ where: { guildId: message.guildId }, data: { disabledCommands: { push: commandName } } });
      client.disabledCommands.get(message.guildId)?.push(commandName);
      message.reply("Disabled");
      return;
    }

    const disabledCommands = client.disabledCommands.get(message.guildId);
    disabledCommands?.splice(disabledCommands.indexOf(commandName), 1);
    await database.guild.update({ where: { guildId: message.guildId }, data: { disabledCommands: { set: disabledCommands } } });

    message.reply("Enabled");
  },
  requiredPermission: "Administrator",
  minimumArguments: 1,
  usage: "toggleCommand <commandName>",
  aliases: ["tcmd"],
};

export default command;
