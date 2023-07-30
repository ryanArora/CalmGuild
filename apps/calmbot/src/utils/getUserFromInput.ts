/* eslint-disable @typescript-eslint/no-empty-function */
import getUUIDFromName from "./apis/mojang";
import isProperId from "./regex/isProperId";
import isProperMinecraftUsername from "./regex/isProperMinecraftUsername";
import { client as database } from "database";
import { Client, MessageMentions, User } from "discord.js";

type InputTypes = "DISCORD_ID" | "DISCORD_MENTION" | "MINECRAFT_USERNAME" | "MINECRAFT_UUID";

export default (client: Client, input: string, allowedInputTypes: InputTypes[] = ["DISCORD_ID", "MINECRAFT_USERNAME", "MINECRAFT_UUID", "DISCORD_MENTION"]): Promise<User | undefined> => {
  return new Promise(async (resolve) => {
    if (allowedInputTypes.includes("DISCORD_ID") && isProperId(input)) {
      const user = await client.users.fetch(input).catch(() => {});
      if (user) return resolve(user);
    }

    if (allowedInputTypes.includes("DISCORD_MENTION") && MessageMentions.UsersPattern.test(input)) {
      const id = input.slice(2, -1);
      const user = await client.users.fetch(id).catch(() => {});
      if (user) return resolve(user);
    }

    if (allowedInputTypes.includes("MINECRAFT_USERNAME") && isProperMinecraftUsername(input)) {
      const uuid = await getUUIDFromName(input).catch(() => {});
      if (uuid) {
        const userData = await database.user.findFirst({
          where: { minecraftUuid: uuid },
          select: { discordId: true },
        });
        if (userData) {
          const user = await client.users.fetch(userData.discordId).catch(() => {});
          if (user) return resolve(user);
        }
      }
    }

    if (allowedInputTypes.includes("MINECRAFT_UUID")) {
      const userData = await database.user.findFirst({
        where: { minecraftUuid: input },
        select: { discordId: true },
      });
      if (userData) {
        const user = await client.users.fetch(userData.discordId).catch(() => {});
        if (user) return resolve(user);
      }
    }

    resolve(undefined);
  });
};
