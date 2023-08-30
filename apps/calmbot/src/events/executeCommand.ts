import { handleCommand } from "../client/command";
import { Event } from "../client/events";
import { getCommand } from "../utils/getCommand";
import { Message } from "discord.js";

const executeCommand: Event = {
  execute: (client, message: Message) => {
    if (!message.inGuild() || message.author.bot) return;

    const prefix = "c!";
    if (!message.content.toLowerCase().startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = getCommand(client.commands, commandName);
    if (!command) return;

    handleCommand(client, command, message, args);
  },
  type: "messageCreate",
};

export default executeCommand;
