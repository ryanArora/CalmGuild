import { escapeMarkdown, EmbedBuilder, Colors } from "discord.js";
import { CommandData } from "../client/command";
import { getGuild } from "../utils/apis/hypixel";
import { getProfileFromUUID } from "../utils/apis/mojang";
import getRole from "../utils/getRole";
import { client as database } from "database";

const command: CommandData = {
  async run(client, message) {
    const hypixelGuild = await getGuild("Calm");
    if (!hypixelGuild) return;

    const users = await database.user.findMany({ where: { minecraftUuid: { in: hypixelGuild.members.map((m) => m.uuid) } } });

    await message.guild.members.fetch();

    const guildMemberRole = await getRole("GUILD_MEMBER", message.guild);
    if (!guildMemberRole) return;

    const reply = await message.reply("Aquiring data (this may take some time)");

    let description = "The following members have the guild member role but are __not in the guild__\n\n";
    let send = false;

    // People with guild member role
    for (const [, member] of guildMemberRole.members) {
      if (!users.find((m) => m.discordId === member.id)) {
        send = true;
        description += `${member.user} (${member.user.username})\n`;
      }
    }

    description += "\nThe following members are in the hypixel guild but not in the discord (or not linked)\n\n";

    // People in hypixel guild
    for (const member of hypixelGuild.members) {
      const userData = users.find((u) => u.minecraftUuid === member.uuid);
      if (!userData || !message.guild.members.cache.get(userData.discordId)) {
        const profile = await getProfileFromUUID(member.uuid);
        description += `${escapeMarkdown(profile?.name ?? member.uuid)}\n`;
        send = true;
      }
    }

    const embed = new EmbedBuilder().setTitle("Member Check").setDescription(description).setColor(Colors.Blurple);
    if (send) reply.edit({ embeds: [embed] });
    else reply.edit("All members check out");
  },
  usage: "checkmembers",
  requiredPermission: "STAFF",
};

export default command;
