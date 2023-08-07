import { MessageReaction, TextChannel } from "discord.js";
import { Event } from "../client/events";
import { client as database } from "database";
import getChannel from "../utils/getChannel";
import { removeSkullboardMessageFromDatabase } from "../utils/skullboard";

const event: Event = {
  execute: async (client, messageReaction: MessageReaction) => {
    if (!messageReaction.message.guild || messageReaction.emoji.name !== "💀") return;
    const guild = messageReaction.message.guild;

    await messageReaction.fetch().catch(console.error);

    const skullboardChannel = await getChannel("SKULLBOARD", guild);
    if (!skullboardChannel || !(skullboardChannel instanceof TextChannel)) return;

    const existingMessage = await database.skullboardMessage.findFirst({ where: { guildId: guild.id, originalMessageId: messageReaction.message.id } });
    if (existingMessage) {
      await removeSkullboardMessageFromDatabase(existingMessage);
      await skullboardChannel.messages
        .fetch(existingMessage.skullboardMessageId)
        .then((message) => message.delete())
        .catch(console.error);
    }
  },
  type: "messageReactionRemoveEmoji",
};

export default event;
