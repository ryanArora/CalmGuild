import { RegisteredButtonInteraction } from "../../client/interactions";
import { client as database } from "database";
import disableButtons from "../../utils/disableButtons";
import getRole from "../../utils/getRole";
import { GuildMember } from "discord.js";
import sendDmOrChannel from "../../utils/sendDmOrChannel";

const interaction: RegisteredButtonInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild || !(interaction.member instanceof GuildMember)) return;
    const guild = interaction.guild;

    await interaction.deferReply();

    const interactionArgs = interaction.customId.split("_");

    const memberId = interactionArgs[1];
    const inactiveExpirationDate = interactionArgs[2];

    const memberData = await database.member.findUnique({ where: { guildId_discordId: { guildId: guild.id, discordId: memberId }, inactivePending: true, currentlyInactive: false }, select: { inactivityExpires: true } });
    if (!memberData || (memberData.inactivityExpires ?? 0) > Date.now()) {
      interaction.editReply("Couldn't accept request");
      return;
    }

    disableButtons(interaction.message);
    await database.member.update({ where: { guildId_discordId: { guildId: guild.id, discordId: memberId } }, data: { inactivePending: false, inactivityExpires: Number(inactiveExpirationDate), currentlyInactive: true } });

    interaction.guild.members
      .fetch(memberId)
      .then(async (member) => {
        const role = await getRole("INACTIVE", guild);
        if (role) member.roles.add(role);

        sendDmOrChannel(client, member.id, guild, { content: `${member.user} Your inactivity request has been accepted` }, "GUILD_ONLY");
        interaction.editReply(`Inactivity accepted by ${interaction.user}`);
      })
      .catch(() => {
        interaction.editReply("Couldn't find member");
      });
  },
  validator: (interaction) => interaction.customId.startsWith("acceptInactive"),
};

export default interaction;