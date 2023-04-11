import { getNameHistoryFromUUID } from "../../utils/apis/mojang";
import { client as database } from "database";
import { CommandData, escapeMarkdown } from "discord.js";

const command: CommandData = {
  run: async (client, message) => {
    if (!message.guild) return;

    const waitlistMembers = await database.user.findMany({
      where: { timeJoinedWaitlist: { not: null } },
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

      const nameHistory = member.minecraftUuid ? await getNameHistoryFromUUID(member.minecraftUuid) : null;
      const name = nameHistory ? nameHistory[nameHistory.length - 1]?.name ?? "Couldn't get name" : "Couldn't get name";

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
