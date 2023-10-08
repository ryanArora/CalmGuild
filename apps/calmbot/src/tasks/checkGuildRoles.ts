import { EmbedBuilder } from "@discordjs/builders";
import { getGuild } from "../utils/apis/hypixel";
import getRole from "../utils/getRole";
import { Task } from "../utils/startTasks";
import { client as database } from "database";
import { Colors } from "discord.js";
import getChannel from "../utils/getChannel";

const task: Task = {
  execute: async (client) => {
    const guild = client.guilds.cache.get(process.env.DEFAULT_DISCORD_SERVER_ID);
    if (!guild) return;

    const channel = await getChannel("GUILD_STAFF", guild);
    if (!channel?.isTextBased()) return;

    const hypixelGuild = await getGuild("Calm");
    if (!hypixelGuild) return;

    const users = await database.user.findMany({ where: { minecraftUuid: { in: hypixelGuild.members.map((m) => m.uuid) } } });

    await guild.members.fetch();

    const guildMemberRole = await getRole("GUILD_MEMBER", guild);
    if (!guildMemberRole) return;

    let description = "The following members have the guild member role but are __not in the guild__\n\n";

    for (const [, member] of guildMemberRole.members) {
      if (!users.find((m) => m.discordId === member.id)) {
        description += `${member.user} (${member.user.username})\n`;
      }
    }

    const embed = new EmbedBuilder().setTitle("Daily Role Checking").setDescription(description).setColor(Colors.Blurple);
    channel.send({ embeds: [embed] });
  },
  cronExpression: "0 0 * * *",
};

export default task;
