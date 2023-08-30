import { client as database } from "database";
import { CommandData, escapeMarkdown } from "discord.js";
import getMinecraftProfile from "../../utils/getMinecraftProfile";

const command: CommandData = {
  run: async (client, message) => {
    const waitlistMembers = await database.member.findMany({
      where: { timeJoinedWaitlist: { not: null } },
      select: { timeJoinedWaitlist: true, informedOnWaitlist: true, frozenOnWaitlist: true, user: { select: { minecraftUuid: true } } },
    });

    if (waitlistMembers.length === 0) {
      message.reply("No members on waitlist");
      return;
    }

    waitlistMembers.sort((a, b) => {
      if (!a.timeJoinedWaitlist || !b.timeJoinedWaitlist || a.timeJoinedWaitlist === b.timeJoinedWaitlist) return 0;
      if (a.timeJoinedWaitlist > b.timeJoinedWaitlist) {
        return 1;
      } else return -1;
    });

    let waitlistMessage = "**Current Waitlist**\n";

    for (const member of waitlistMembers) {
      const position = waitlistMembers.indexOf(member) + 1;

      const mojangProfile = member.user.minecraftUuid ? await getMinecraftProfile(member.user.minecraftUuid, ["MINECRAFT_UUID"]) : null;
      const name = mojangProfile ? mojangProfile.name ?? "Couldn't get name" : "Couldn't get name";

      const waitlistSuffixes: string[] = [];
      if (member.informedOnWaitlist) waitlistSuffixes.push("Informed");
      if (member.frozenOnWaitlist) waitlistSuffixes.push("Frozen");

      waitlistMessage += `${position}. ${escapeMarkdown(name)}${
        waitlistSuffixes.length !== 0
          ? ` | **${waitlistSuffixes
              .map((suffix) => `${suffix}, `)
              .join("")
              .slice(0, -2)}**`
          : ""
      }\n`;
    }

    message.reply(waitlistMessage);
  },
  usage: "waitlist",
  aliases: ["wl"],
  defaultSubcommand: true,
};

export default command;
