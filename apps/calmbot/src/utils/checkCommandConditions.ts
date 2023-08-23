import { Command } from "../client/command";
import checkPermission from "./checkPermission";
import { Message } from "discord.js";
import { client as database } from "database";
import findOrCreateMemberArgs from "./database/findOrCreateMemberArgs";
export const checkCommandConditions = async (command: Command, message: Message, args: string[]) => {
  const requiredPermission = command.requiredPermission;
  if (requiredPermission && message.member) {
    const hasPermission = await checkPermission(message.member, requiredPermission);

    if (!hasPermission) {
      message.reply(`You are missing permission: \`${requiredPermission}\``);
      return false;
    }
  }

  const minimumArguments = command.minimumArguments;
  if (minimumArguments && args.length < minimumArguments) {
    message.reply(`You need at least ${minimumArguments} arguments\nUsage: \`${command.usage}\``);
    return false;
  }

  if (command.ensureMemberDataExists && message.guild) {
    await database.user.upsert({ ...findOrCreateMemberArgs(message.author.id, message.guild.id) });
  }

  return true;
};
