import { ChannelType } from "database";
import { Client, Guild, MessageCreateOptions, TextChannel } from "discord.js";
import getChannel from "./getChannel";

// Attempts to DM a user a message,
// if this user has their DMs closed it will send the message in the fallback channel provided
export default async (client: Client, userId: string, guild: Guild, channel: ChannelType | TextChannel, message: MessageCreateOptions) => {
  return new Promise(() => {
    client.users
      .fetch(userId)
      .then((user) => {
        user.send(message).catch(async () => {
          if (channel instanceof TextChannel) {
            channel.send(message);
            return;
          }

          const textChannel = await getChannel(channel, guild);
          if (textChannel && textChannel instanceof TextChannel) textChannel.send(message);
        });
      })
      .catch();
  });
};
