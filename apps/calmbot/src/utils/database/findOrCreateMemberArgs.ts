import { Prisma } from "database";
export default (discordId: string, guildId: string): Omit<Prisma.UserUpsertArgs, "select" | "include"> => {
  return { where: { discordId }, create: { discordId, members: { create: { guildId } } }, update: { members: { upsert: { where: { guildId_discordId: { guildId, discordId } }, create: { guildId }, update: {} } } } };
};
