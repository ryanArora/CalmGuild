import { Message, PartialMessage } from "discord.js";

export default (message: Message | PartialMessage) => {
  if (message.attachments.size > 0 || message.embeds.length > 0) {
    return getImageUrlFromAttachment(message) ?? getImageUrlFromEmbed(message);
  }

  return undefined;
};

const getImageUrlFromAttachment = (message: Message | PartialMessage) => message.attachments.filter((attachment) => attachment.contentType?.startsWith("image") ?? false).first()?.url;
const getImageUrlFromEmbed = (message: Message | PartialMessage) => message.embeds.filter((embed) => embed.data.type === "image")[0]?.url ?? undefined;
