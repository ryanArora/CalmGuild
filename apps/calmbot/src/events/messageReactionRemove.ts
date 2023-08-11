import { MessageReaction, TextChannel } from "discord.js";
import { Event } from "../client/events";
import { client as database } from "database";
import getChannel from "../utils/getChannel";
import { createSkullboardMessage, updateSkullboardMessage } from "../utils/skullboard";

const event: Event = {
  execute: async (client, messageReaction: MessageReaction) => {
    if (!messageReaction.message.guild || messageReaction.emoji.name !== "💀") return;
    const guild = messageReaction.message.guild;

    await messageReaction.fetch().catch(console.error);

    const skullboardChannel = await getChannel("SKULLBOARD", guild);
    if (!skullboardChannel || !(skullboardChannel instanceof TextChannel)) return;

    const existingMessage = await database.skullboardMessage.findFirst({ where: { guildId: guild.id, originalMessageId: messageReaction.message.id } });
    if (existingMessage) {
      await updateSkullboardMessage(messageReaction, existingMessage, skullboardChannel);
      return;
    }

    if (messageReaction.count > 5) await createSkullboardMessage(messageReaction, skullboardChannel);
  },
  type: "messageReactionRemove",
};

export default event;