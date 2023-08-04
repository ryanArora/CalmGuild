import { Message } from "discord.js";
import { Event } from "../client/events";
import getChannel from "../utils/getChannel";
import { client as database } from "database";
import { getGuild } from "../utils/apis/hypixel";
import { sendCommand } from "../utils/apis/minecraftBot";
import { getProfileFromUUID } from "../utils/apis/mojang";

const handleBridgeMessage: Event = {
  execute: async (client, message: Message) => {
    if (message.content.length === 0 || !message.guild || message.author.bot) return;

    const channel = await getChannel("GUILD_BRIDGE", message.guild);
    if (message.channelId !== channel?.id) return;

    const user = await database.user.findFirst({ where: { discordId: message.author.id }, select: { minecraftUuid: true } });
    const guild = await getGuild("Calm");

    if (!user?.minecraftUuid || !guild?.members.find((member) => member.uuid === user.minecraftUuid)) {
      message.reply("⚠️ You are not in calm guild");
      return;
    }

    const profile = await getProfileFromUUID(user.minecraftUuid);
    if (!profile) return;

    const characterLimit = 252 - (profile.name.length + 3);

    if (message.content.length > characterLimit) {
      message.reply(`⚠️ Message in excess of character limit. Reduce message by ${message.content.length - characterLimit} characters.`);
      return;
    }

    sendCommand(`/gc [${profile.name}] ${message.content}`)
      .then(() => {
        message.react("✅");
      })
      .catch(console.error);
  },
  type: "messageCreate",
};

export default handleBridgeMessage;
