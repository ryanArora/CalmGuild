// Give roles to members for being in the guild for 6 months & 12 months

import { Collection } from "discord.js";
import { getGuild } from "../utils/apis/hypixel";
import { Task } from "../utils/startTasks";
import { client as database } from "database";
import getChannel from "../utils/getChannel";
const task: Task = {
  execute: async (client) => {
    const guild = client.guilds.cache.get(process.env.DEFAULT_DISCORD_SERVER_ID);
    if (!guild) return;

    const hypixelGuild = await getGuild("Calm");
    if (!hypixelGuild) return;

    const loyaltyRoles = await database.loyaltyRole.findMany({ where: { guildId: guild.id } });
    if (loyaltyRoles.length === 0) return;

    const loyaltyRoleMap: Collection<string, string[]> = new Collection(); // K = roleId, V = array of uuids
    for (const role of loyaltyRoles.sort((a, b) => Number(b.timeRequiredToEarnMs - a.timeRequiredToEarnMs))) {
      loyaltyRoleMap.set(
        role.roleId,
        hypixelGuild.members.filter((m) => Date.now() - m.joined >= role.timeRequiredToEarnMs).map((m) => m.uuid)
      );
    }

    const userData = await database.user.findMany({ where: { minecraftUuid: { in: Array.from(loyaltyRoleMap.values()).flat() } }, select: { minecraftUuid: true, discordId: true } });
    await guild.members.fetch({ user: userData.map((u) => u.discordId) });

    let message = "";
    for (const [role, members] of loyaltyRoleMap) {
      if (members.length === 0) continue;

      const discordRole = guild.roles.cache.get(role);
      if (!discordRole) continue;

      const membersRecievingRole = guild.members.cache.filter((member) => userData.filter((u) => members.includes(u.minecraftUuid ?? "")).find((u) => u.discordId === member.id) && !member.roles.cache.get(role));
      if (membersRecievingRole.size === 0) continue;

      message += `## ${discordRole.name}:\n`;
      for (const [, member] of membersRecievingRole) {
        member.roles.add(discordRole);
        message += `- ${member.user} \n`;
      }
    }

    const channel = await getChannel("GUILD_ANNOUNCEMENTS", guild);
    if (channel?.isTextBased() && message !== "") channel.send(`Congratulations to the following member(s) on their promotions:\n${message}`);
  },
  cronExpression: "0 12 * * *",
};

export default task;
