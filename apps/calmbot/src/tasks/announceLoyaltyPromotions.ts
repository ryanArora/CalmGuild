import { Collection } from "discord.js";
import { getGuild } from "../utils/apis/hypixel";
import { Task } from "../utils/startTasks";
import { client as database } from "database";
import getChannel from "../utils/getChannel";

const task: Task = {
  execute: async (client) => {
    const guild = client.guilds.cache.get(process.env.DEFAULT_DISCORD_SERVER_ID);
    if (!guild) return;

    const channel = await getChannel("GUILD_ANNOUNCEMENTS", guild);
    if (!channel?.isTextBased()) return;

    const loyaltyRoles = await database.loyaltyRole.findMany({ where: { guildId: guild.id } });
    if (loyaltyRoles.length === 0) return;

    const hypixelGuild = await getGuild("Calm");
    if (!hypixelGuild) return;

    const oneWeekMs = 1000 * 60 * 60 * 24 * 7;

    const loyaltyRoleMap: Collection<string, string[]> = new Collection();

    for (const role of loyaltyRoles) {
      if (!guild.roles.cache.get(role.roleId)) continue;

      const members = [];
      for (const member of hypixelGuild.members) {
        const timeInGuild = Date.now() - member.joined;
        if (timeInGuild - oneWeekMs < role.timeRequiredToEarnMs && timeInGuild >= role.timeRequiredToEarnMs) {
          members.push(member.uuid);
        }
      }
      if (members.length !== 0) loyaltyRoleMap.set(role.roleId, members);
    }

    if (loyaltyRoleMap.size === 0) return;

    const userData = await database.user.findMany({ where: { minecraftUuid: { in: Array.from(loyaltyRoleMap.values()).flat() } }, select: { minecraftUuid: true, discordId: true } });
    await guild.members.fetch({ user: userData.map((u) => u.discordId) });

    let message = "Congratulations to the following member(s) on their promotions over the past week:\n";
    for (const [role, members] of loyaltyRoleMap) {
      const discordRole = guild.roles.cache.get(role);
      if (!discordRole) continue;

      message += `## ${discordRole.name}\n`;
      for (const m of members) {
        const discordMember = guild.members.cache.get(userData.find((u) => m === u.minecraftUuid)?.discordId ?? "");
        if (!discordMember) continue;

        message += `${discordMember.user}\n`;
      }
    }

    channel.send(message);
  },
  cronExpression: "58 23 * * 6",
};

export default task;
