import getMinecraftProfile from "./getMinecraftProfile";
import getRole from "./getRole";
import { client as database } from "database";
import { Channel, GuildMember, ActionRowBuilder, ButtonBuilder, EmbedBuilder, OverwriteData, PermissionResolvable, PermissionsBitField, ButtonStyle, MessageActionRowComponentBuilder, CategoryChannel } from "discord.js";

const { ViewChannel, ReadMessageHistory, SendMessages, UseExternalEmojis, AttachFiles, EmbedLinks } = PermissionsBitField.Flags;

const ALLOW_PERMISSIONS: PermissionResolvable[] = [ViewChannel, ReadMessageHistory, SendMessages, UseExternalEmojis, AttachFiles, EmbedLinks];

export default (member: GuildMember, uuid: string): Promise<Channel> => {
  return new Promise(async (resolve, reject) => {
    const permissions: OverwriteData[] = [
      { id: member.guild.roles.everyone, deny: ViewChannel },
      { id: member, allow: ALLOW_PERMISSIONS },
    ];

    const applicationsTeam = await getRole("APPLICATIONS_TEAM", member.guild);
    if (applicationsTeam) permissions.push({ id: applicationsTeam, allow: ALLOW_PERMISSIONS });

    const mojangProfile = await getMinecraftProfile(uuid, ["MINECRAFT_UUID"]);
    if (!mojangProfile) return reject("Couldn't fetch minecraft name");

    const name = mojangProfile.name;

    member.guild.channels
      .create({
        name: `app${name ? `-${name}` : ""}`,
        permissionOverwrites: permissions,
        parent: member.guild.channels.cache.find((c) => c instanceof CategoryChannel && ["apps", "applications"].includes(c.name.toLowerCase())) as CategoryChannel,
      })
      .then(async (channel) => {
        const guildData = await database.guild.findFirst({
          where: { guildId: member.guild.id },
          select: { applicationQuestions: true },
        });
        const applicationQuestions = guildData?.applicationQuestions.map((question) => `**${question}**:\n\n`).join("") ?? "";

        const embed = new EmbedBuilder().setTitle("Application for Calm Guild");
        embed.setDescription(
          `Welcome! Please copy and paste the format below and send your answers to each question in this channel. Then, when you are done, click the "Submit Application" button below. If it was not your intention to apply, click the "Cancel" button below\n\n${applicationQuestions}`
        );

        const submitButton = new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Submit Application").setCustomId(`submitApplication_${member.id}`);
        const cancelButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Cancel").setCustomId(`cancelApplication_${member.id}`);
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>({
          components: [submitButton, cancelButton],
        });

        channel.send({
          content: member.toString(),
          embeds: [embed],
          components: [row],
        });
        resolve(channel);
      })
      .catch(reject);
  });
};
