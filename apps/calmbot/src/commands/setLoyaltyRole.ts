import { CommandData } from "../client/command";
import getRoleFromInput from "../utils/getRoleFromInput";
import { client as database } from "database";

const command: CommandData = {
  run: async (client, message, args) => {
    const role = getRoleFromInput(message.guild.roles.cache, args[0]);
    if (!role) {
      message.reply("Couldn't find that role");
      return;
    }

    const value = args[1].toLowerCase();
    if (value !== "none" && isNaN(Number(value))) {
      message.reply("That isnt a valid number. Please time the time in __milliseconds__ or type `none` to unset it.");
      return;
    }

    if (value === "none") {
      const existingDocument = await database.loyaltyRole.findUnique({ where: { guildId_roleId: { guildId: message.guildId, roleId: role.id } } });

      if (!existingDocument) {
        message.reply("This role isnt assigned to a loyalty role!");
        return;
      }

      await database.loyaltyRole.delete({ where: { guildId_roleId: { guildId: message.guildId, roleId: role.id } } });
      message.reply("Done");
      return;
    }

    await database.loyaltyRole.upsert({
      where: { guildId_roleId: { guildId: message.guildId, roleId: role.id } },
      create: { roleId: role.id, guildId: message.guildId, timeRequiredToEarnMs: Number(value) },
      update: { timeRequiredToEarnMs: Number(value) },
    });

    message.reply("Done");
  },
  minimumArguments: 2,
  usage: "setloyaltyrole <role> <time in milliseconds OR none>",
  requiredPermission: "Administrator",
  aliases: ["slr"],
};

export default command;
