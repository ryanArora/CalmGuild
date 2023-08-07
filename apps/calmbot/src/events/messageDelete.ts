import { Message, TextChannel } from "discord.js";
import { Event } from "../client/events";
import { client as database } from "database";
import getChannel from "../utils/getChannel";
import { removeSkullboardMessageFromDatabase } from "../utils/skullboard";

const event: Event = {
  execute: async (client, message: Message) => {
    if (!message.guild) return;
    const guild = message.guild;

    const skullboardChannel = await getChannel("SKULLBOARD", guild);
    if (!skullboardChannel || !(skullboardChannel instanceof TextChannel)) return;

    const existingMessage = await database.skullboardMessage.findFirst({ where: { guildId: guild.id, originalMessageId: message.id } });
    if (existingMessage) {
      await removeSkullboardMessageFromDatabase(existingMessage);
      await skullboardChannel.messages
        .fetch(existingMessage.skullboardMessageId)
        .then((message) => message.delete())
        .catch(console.error);
      return;
    }
  },
  type: "messageDelete",
};

export default event;
