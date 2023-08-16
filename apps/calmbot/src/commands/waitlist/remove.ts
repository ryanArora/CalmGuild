import findOrCreateMemberArgs from "../../utils/database/findOrCreateMemberArgs";
import getRole from "../../utils/getRole";
import getUserFromInput from "../../utils/getUserFromInput";
import { client as database } from "database";
import { CommandData } from "discord.js";

const command: CommandData = {
  run: async (client, message, args) => {
    if (!message.guild || !args[0]) return;

    const user = await getUserFromInput(client, args[0]);
    if (!user) {
      message.reply("Couldn't find user");
      return;
    }

    const data = await database.user.upsert({ ...findOrCreateMemberArgs(user.id, message.guild.id), select: { members: { select: { timeJoinedWaitlist: true, discordId: true } } } });
    const memberData = data.members.find((member) => member.discordId === user.id);
    if (!memberData || !memberData.timeJoinedWaitlist) {
      message.reply("User not on waitlist");
      return;
    }

    await database.member.update({
      where: { guildId_discordId: { discordId: user.id, guildId: message.guild.id } },
      data: {
        timeJoinedWaitlist: null,
        informedOnWaitlist: null,
        frozenOnWaitlist: null,
      },
    });

    message.reply("Removed from waitlist");

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const member = await message.guild.members.fetch(user.id).catch(() => {});
    if (member) {
      const waitlistRole = await getRole("WAITLIST", message.guild);
      if (waitlistRole) member.roles.remove(waitlistRole);
    }
  },
  requiredPermission: "STAFF",
  minimumArguments: 1,
  usage: "waitlist remove <user>",
};

export default command;
