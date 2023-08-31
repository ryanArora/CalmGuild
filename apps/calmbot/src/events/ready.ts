import { Event } from "../client/events";
import { Prisma, client as database } from "database";

const readyEvent: Event = {
  execute: async (client) => {
    console.log(`${client.user?.tag} is online`);

    // Create guild entry in database if it doesn't exist and populate disabledCommands
    const guilds = client.guilds.cache;
    const guildData = await database.guild.findMany({ select: { guildId: true, disabledCommands: true } });

    const toAdd: Prisma.GuildCreateManyInput[] = [];

    for (const [, guild] of guilds) {
      const databaseGuild = guildData.find((g) => g.guildId === guild.id);
      if (databaseGuild) {
        client.disabledCommands.set(databaseGuild.guildId, databaseGuild.disabledCommands);
        continue;
      }

      toAdd.push({ guildId: guild.id });
      client.disabledCommands.set(guild.id, []);
    }

    if (toAdd.length !== 0) await database.guild.createMany({ data: toAdd }).then((batch) => console.log(`Created ${batch.count} new guild documents`));
  },
  type: "ready",
};

export default readyEvent;
