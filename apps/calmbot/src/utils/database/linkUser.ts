import { client as database } from "database";

export default (discordId: string, minecraftUuid: string, guildId: string) =>
  database.user.upsert({
    where: { discordId: discordId },
    update: { minecraftUuid: minecraftUuid, members: { upsert: { where: { guildId_discordId: { guildId: guildId, discordId: discordId } }, create: { guildId: guildId }, update: {} } } },
    create: { discordId: discordId, minecraftUuid: minecraftUuid, members: { create: { guildId: guildId } } },
  });
