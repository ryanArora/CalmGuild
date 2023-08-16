import getUserFromInput from "../../utils/getUserFromInput";
import { client as database } from "database";
import { CommandData } from "discord.js";
import findOrCreateMemberArgs from "../../utils/database/findOrCreateMemberArgs";

const command: CommandData = {
  run: async (client, message, args) => {
    if (!message.guild || !args[0]) return;

    const user = await getUserFromInput(client, args[0]);
    if (!user) {
      message.reply("Couldn't find user");
      return;
    }

    const data = await database.user.upsert({ ...findOrCreateMemberArgs(user.id, message.guild.id), select: { members: { select: { timeJoinedWaitlist: true, informedOnWaitlist: true, discordId: true } } } });
    const memberData = data.members.find((member) => member.discordId === user.id);

    if (!memberData || !memberData.timeJoinedWaitlist) {
      message.reply("User not on waitlist");
      return;
    }

    await database.member.update({
      where: { guildId_discordId: { discordId: user.id, guildId: message.guild.id } },
      data: { informedOnWaitlist: !memberData.informedOnWaitlist },
    });
    message.reply(`User ${memberData.informedOnWaitlist ? "un" : ""}informed`);
  },
  requiredPermission: "STAFF",
  minimumArguments: 1,
  usage: "waitlist inform <user>",
};

export default command;
