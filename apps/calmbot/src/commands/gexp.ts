import { client as database } from "database";
import { CommandData } from "../client/command";
import { HypixelGuild, getGuild } from "../utils/apis/hypixel";
import { getProfileFromUUID } from "../utils/apis/mojang";
import { EmbedBuilder, escapeMarkdown } from "@discordjs/builders";
import { Colors } from "discord.js";

const oneWeekMs = 1000 * 60 * 60 * 24 * 7;

const command: CommandData = {
  run: async (client, message) => {
    const guild = await getGuild("Calm");
    if (!guild) {
      message.reply("Couldn't find hypixel guild");
      return;
    }

    const response = await message.reply("Fetching data... this may take some time.");

    // For some reason this isn't included in the response from the api
    guild.ranks.push({ name: "Guild Master", priority: Infinity, default: false });

    // For the purpsoe of formating message, sort from most gexp to least
    const members = guild?.members.sort((a, b) => add(b.expHistory) - add(a.expHistory)).sort((b, a) => rankPriority(guild, a.rank) - rankPriority(guild, b.rank));

    // Get people who are exempt from gexp requirements from database
    const inactiveMembers = await database.member.findMany({ where: { currentlyInactive: true }, select: { user: { select: { minecraftUuid: true } } } });

    // Message to be sent to channel containing the data
    let dataMessage = "";
    let currentRank = "";
    for (const member of members) {
      // Must check to see if their member rank aligns with list of ranks in guild
      // For some reason sometimes the members rank isn't a real rank in the guild
      // If this is the case default to the guilds default rank
      let memberRank = guild.ranks.find((r) => r.name === member.rank);
      if (!memberRank) memberRank = guild.ranks.find((r) => r.default);

      // Create the ranking header if its the first member in that category
      if (currentRank !== memberRank?.name) {
        dataMessage += `\n**${memberRank?.name}**\n`;
        currentRank = memberRank?.name ?? "";
      }

      const weeklyGexp = add(member.expHistory);

      // If either of these are true, mark them as gexp exempt
      const inactive = inactiveMembers.find((u) => u.user.minecraftUuid === member.uuid) !== undefined;
      const newMember = Date.now() - member.joined <= oneWeekMs;

      const name = (await getProfileFromUUID(member.uuid))?.name ?? "N/A";
      dataMessage += `${inactive || newMember ? "**Exempt** " : ""}${escapeMarkdown(name)}: ${weeklyGexp}\n`;
    }

    response.edit({
      content: "",
      embeds: [
        new EmbedBuilder().setTitle("Gexp for the past week").setDescription(dataMessage).setFooter({ text: "Members marked as exempt are marked that way either beacuse they are new to the guild or inactive" }).setColor(Colors.Blurple),
      ],
    });
  },
  usage: "gexp",
  requiredPermission: "STAFF",
};

// gets weekly gexp based on history
const add = (data: HypixelGuild["members"][0]["expHistory"]) => Object.values(data).reduce((a, c) => a + c);
const rankPriority = (guild: HypixelGuild, rank: HypixelGuild["members"][0]["rank"]) => {
  const priority = guild.ranks.find((r) => r.name === rank)?.priority;
  return priority ?? 1;
};

export default command;
