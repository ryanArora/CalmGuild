import { MessageReaction, TextChannel, EmbedBuilder } from "discord.js";
import { SkullboardMessage, client as database } from "database";
import getImageFromMessage from "./getImageFromMessage";

export const createSkullboardMessage = async (messageReaction: MessageReaction, skullboardChannel: TextChannel) => {
  if (!messageReaction.message.guild) return;
  const guildId = messageReaction.message.guild.id;

  const embed = createEmbed(messageReaction);

  skullboardChannel
    .send({ content: `💀 ${messageReaction.count} ${messageReaction.message.channel}`, embeds: [embed] })
    .then(async (message) => {
      await database.skullboardMessage.create({ data: { originalMessageId: messageReaction.message.id, skullboardMessageId: message.id, guildId: guildId } });
    })
    .catch(console.error);
};

export const updateSkullboardMessage = async (messageReaction: MessageReaction, skulledMessage: SkullboardMessage, skullboardChannel: TextChannel) => {
  skullboardChannel.messages
    .fetch(skulledMessage.skullboardMessageId)
    .then(async (message) => {
      if (messageReaction.count < 2) {
        await message.delete();
        await removeSkullboardMessageFromDatabase(skulledMessage);
      } else message.edit({ content: `💀 ${messageReaction.count} ${messageReaction.message.channel}` });
    })
    .catch(async () => {
      await removeSkullboardMessageFromDatabase(skulledMessage);
    });
};

const createEmbed = (messageReaction: MessageReaction): EmbedBuilder => {
  const embed = new EmbedBuilder();
  const message = messageReaction.message;

  embed.setAuthor({ name: message.member?.nickname ?? message.author?.username ?? "Unavalaible", iconURL: message.member?.user.avatarURL() ?? message.author?.avatarURL() ?? undefined });
  const image = getImageFromMessage(message);

  if (image) embed.setImage(image);
  else if (message.attachments.size > 0) {
    embed.addFields([{ name: "Attachment", value: message.attachments.first()?.url ?? "Unavaliable" }]);
  }

  if (message.content !== null) embed.setDescription(message.content);

  embed.addFields([{ name: "Source", value: `[Jump!](${message.url})` }]);
  embed.setColor("White");
  embed.setTimestamp();

  return embed;
};

export const removeSkullboardMessageFromDatabase = async (skullboardMessage: SkullboardMessage) => database.skullboardMessage.delete({ where: { originalMessageId: skullboardMessage.originalMessageId } });
