import { ChannelType } from "database";
import { BaseChannel, Client, Guild, MessageCreateOptions, TextChannel } from "discord.js";
import getChannel from "./getChannel";

// Attempts to DM a user a message,
// if this user has their DMs closed it will send the message in the fallback channel provided
export default async (client: Client, userId: string, guild: Guild, message: MessageCreateOptions, channel?: ChannelType | BaseChannel) => {
  return new Promise(async () => {
    const user = client.users.cache.get(userId) ?? (await client.users.fetch(userId));

    user.send(message).catch(async () => {
      if (!channel) return;

      if (channel instanceof BaseChannel) {
        if (channel.isTextBased()) channel.send(message);
        return;
      }

      const textChannel = await getChannel(channel, guild);
      if (textChannel && textChannel instanceof TextChannel) textChannel.send(message);
    });
  });
};
