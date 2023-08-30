import getUserFromInput from "../../utils/getUserFromInput";
import { client as database } from "database";
import { CommandData } from "discord.js";

const command: CommandData = {
  run: async (client, message, args) => {
    if (!args[0]) return;

    const user = await getUserFromInput(client, args[0]);
    if (!user) {
      message.reply("Couldn't find user");
      return;
    }

    const memberData = await database.member.findUnique({ where: { guildId_discordId: { discordId: user.id, guildId: message.guildId } }, select: { timeJoinedWaitlist: true, frozenOnWaitlist: true, discordId: true } });

    if (!memberData || !memberData.timeJoinedWaitlist) {
      message.reply("User not on waitlist");
      return;
    }

    await database.member.update({
      where: { guildId_discordId: { discordId: user.id, guildId: message.guildId } },
      data: { frozenOnWaitlist: !memberData.frozenOnWaitlist },
    });
    message.reply(`User ${memberData.frozenOnWaitlist ? "un" : ""}frozen`);
  },
  requiredPermission: "STAFF",
  minimumArguments: 1,
  usage: "waitlist frozen <user>",
  ensureMemberDataExists: true,
};

export default command;
