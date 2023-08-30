import { Colors, EmbedBuilder, Guild } from "discord.js";
import { Task } from "../utils/startTasks";
import { client as database } from "database";
import sendDmOrChannel from "../utils/sendDmOrChannel";
import getChannel from "../utils/getChannel";

const task: Task = {
  execute: async (client, date) => {
    const members = await database.member.findMany({
      where: { currentlyInactive: true, inactivityExpires: { lt: date.getTime() } },
      select: {
        guildId: true,
        discordId: true,
        guild: { select: { roles: { where: { roleType: "INACTIVE" }, select: { roleId: true, roleType: true } }, channels: { where: { channelType: "GUILD_ONLY" }, select: { channelId: true, channelType: true } } } },
      },
    });

    await database.member.updateMany({ where: { inactivityExpires: { lt: date.getTime() }, currentlyInactive: true }, data: { currentlyInactive: false } });

    const membersByGuild: Map<Guild, string[]> = new Map(); // Used for sending a message to each guild about the members that had expired inactivity

    for (const memberData of members) {
      const guild = client.guilds.cache.get(memberData.guildId);
      if (!guild) continue;

      addMemberToMap(membersByGuild, guild, `<@${memberData.discordId}>`);

      const roleId = memberData.guild.roles.find((role) => role.roleType === "INACTIVE")?.roleId;
      if (!roleId) continue;

      const role = guild.roles.cache.get(roleId);
      if (!role) continue;

      let member = guild.members.cache.get(memberData.discordId);
      if (!member) {
        await fetchMembersFromGuild(members, guild);
        member = guild.members.cache.get(memberData.discordId);
        if (!member) continue;
      }

      member.roles.remove(role);

      const channel = guild.channels.cache.get(memberData.guild.channels.find((c) => c.channelType === "GUILD_ONLY")?.channelId ?? "");
      sendDmOrChannel(client, member.user.id, guild, { content: `${member.user} your inactivity has expired. If you need more time please contact a staff member or create another request.` }, channel);
    }

    // Send a message to each guild individually about which members inactive role was removed
    for (const [guild, members] of membersByGuild) {
      const channel = await getChannel("INACTIVITY_REQUESTS", guild);
      if (channel && channel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle("Inactivity Expirations")
          .setDescription(`The following member(s) inactivity have expired:\n${members.join("\n")}`);

        channel.send({ embeds: [embed] });
      }
    }
  },
  cronExpression: "0 0 * * 1",
};

const fetchMembersFromGuild = async (members: { guildId: string; discordId: string }[], guild: Guild) => {
  return guild.members.fetch({
    user: members.filter((member) => member.guildId === guild.id).map((member) => member.discordId),
  });
};

const addMemberToMap = (map: Map<Guild, string[]>, guild: Guild, memberString: string) => {
  if (!map.get(guild)) {
    map.set(guild, [memberString]);
    return;
  }

  map.get(guild)?.push(memberString);
};

export default task;
