import { getGuild } from "../utils/apis/hypixel";
import createApplication from "../utils/createApplication";
import getRole from "../utils/getRole";
import { client as database } from "database";
import { CommandData, TextChannel } from "discord.js";

const command: CommandData = {
  run: async (client, message) => {
    if (!message.guild || !message.member) return;
    const guildId = message.guild.id;

    const waitlistRole = await getRole("WAITLIST", message.guild);
    if (waitlistRole && message.member.roles.cache.has(waitlistRole.id)) {
      message.reply("You are already on the waitlist!");
      return;
    }

    const memberData = await database.member.findUnique({
      where: { guildId_discordId: { discordId: message.author.id, guildId: message.guild.id } },
      select: { guildApplicationChannelId: true, discordId: true, user: { select: { minecraftUuid: true } } },
    });
    console.log(memberData);

    if (!memberData || !memberData.user.minecraftUuid) {
      message.reply("You must link your discord account to your minecraft ign before applying. Please use the c!link (ign) command and then run c!apply again.");
      return;
    }

    const guild = await getGuild("Calm");
    if (guild && guild.members.find((m) => m.uuid === memberData.user.minecraftUuid)) {
      message.reply("You are already in the guild!");
      return;
    }

    if (memberData.guildApplicationChannelId) {
      const channel = message.guild.channels.cache.get(memberData.guildApplicationChannelId);
      if (channel && channel instanceof TextChannel) {
        if (channel.permissionsFor(message.member).has("ViewChannel")) {
          message.reply(`You already have an open application, ${channel}`);
          return;
        }

        message.reply(`Your application is currently pending review!`);
        return;
      }
    }

    createApplication(message.member, memberData.user.minecraftUuid)
      .then(async (channel) => {
        message.reply(`Opened an appliation for you, ${channel}`);
        await database.member.update({
          where: { guildId_discordId: { guildId: guildId, discordId: message.author.id } },
          data: { guildApplicationChannelId: channel.id },
        });
      })
      .catch((err) => {
        console.error(err);
        message.reply("Error creating your application, please contact a staff member.");
      });
  },
  usage: "apply",
  ensureMemberDataExists: true,
};

export default command;
