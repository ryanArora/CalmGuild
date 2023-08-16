import { RegisteredModalSubmitInteraction } from "../../client/interactions";
import { client as database } from "database";
import { GuildMember, ButtonBuilder, EmbedBuilder, OverwriteData, PermissionResolvable, Colors, ButtonStyle, ActionRowBuilder, MessageActionRowComponentBuilder } from "discord.js";
import { PermissionsBitField } from "discord.js";

const { ViewChannel, ReadMessageHistory, SendMessages, UseExternalEmojis, AttachFiles, EmbedLinks } = PermissionsBitField.Flags;

const ALLOW_PERMISSIONS: PermissionResolvable[] = [ViewChannel, ReadMessageHistory, SendMessages, UseExternalEmojis, AttachFiles, EmbedLinks];

const interaction: RegisteredModalSubmitInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild || !(interaction.member instanceof GuildMember)) return;

    await interaction.deferReply({ ephemeral: true });

    const guildData = await database.guild.findFirst({
      where: { guildId: interaction.guild.id },
      select: { ticketRoleIds: true },
    });

    const reason = interaction.fields.getTextInputValue("reason");

    const permissions: OverwriteData[] = [
      { id: interaction.guild.roles.everyone, deny: ViewChannel },
      { id: interaction.member.id, allow: ALLOW_PERMISSIONS },
    ];

    if (guildData?.ticketRoleIds) {
      for (const roleId of guildData.ticketRoleIds) {
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) continue;
        permissions.push({ id: roleId, allow: ALLOW_PERMISSIONS });
      }
    }

    interaction.guild.channels
      .create({
        name: `ticket-${interaction.user.username}`,
        permissionOverwrites: permissions,
      })
      .then(async (ticketChannel) => {
        await database.member.update({
          where: { guildId_discordId: { discordId: interaction.user.id, guildId: ticketChannel.guildId } },
          data: { openTicketChannelId: ticketChannel.id },
        });

        const embed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setDescription(reason !== "" ? reason : "No reason provided")
          .addFields([{ name: "Opened By", value: interaction.user.toString() }]);
        const closeTicketButton = new ButtonBuilder().setLabel("Close Ticket").setCustomId(`closeTicket`).setStyle(ButtonStyle.Danger);

        ticketChannel
          .send({
            embeds: [embed],
            components: [
              new ActionRowBuilder<MessageActionRowComponentBuilder>({
                components: [closeTicketButton],
              }),
            ],
          })
          .then((m) => m.pin());

        interaction.editReply(`Opened a ticket for you, ${ticketChannel}`);
      })
      .catch((err) => {
        interaction.editReply("Error creating ticket channel");
        console.error(err);
      });
  },
  validator: (interaction) => interaction.customId.toLowerCase() === "createticket",
};

export default interaction;
