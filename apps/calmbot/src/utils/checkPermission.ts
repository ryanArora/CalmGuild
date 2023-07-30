import getRole from "./getRole";
import { GuildMember, PermissionFlagsBits, PermissionResolvable } from "discord.js";

export type Permission = PermissionResolvable | "STAFF";

export default async (member: GuildMember, permission: Permission) => {
  if (permission === "STAFF") {
    if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;

    const discordStaff = await getRole("DISCORD_STAFF", member.guild);
    const guildStaff = await getRole("GUILD_STAFF", member.guild);

    if (discordStaff && member.roles.cache.has(discordStaff.id)) return true;
    if (guildStaff && member.roles.cache.has(guildStaff.id)) return true;

    return false;
  }

  return member.permissions.has(permission);
};
