import { RegisteredSelectMenuInteraction } from "../../client/interactions";
import { client as database } from "database";
import { getGuild } from "../../utils/apis/hypixel";
import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const interaction: RegisteredSelectMenuInteraction = {
  execute: async (client, interaction) => {
    if (!interaction.guild) return;

    const memberData = await database.member.findUnique({
      where: { guildId_discordId: { guildId: interaction.guild.id, discordId: interaction.user.id } },
      select: { inactivityExpires: true, currentlyInactive: true, inactivePending: true, user: { select: { minecraftUuid: true } } },
    });

    if (memberData?.currentlyInactive) {
      interaction.reply({ content: `You are already inactive until <t:${Math.floor(Number(memberData?.inactivityExpires ?? 0) / 1000)}:d>\nContact staff if you wish to change this`, ephemeral: true });
      return;
    }

    if (memberData?.inactivePending) {
      interaction.reply({
        content: `Your already have an inactivity request that is pending, you will be notified once it is accepted or denied\n\nIf it has been an extensive time since making this request, please contact staff`,
        ephemeral: true,
      });
      return;
    }

    const guild = await getGuild("Calm");
    if (!guild?.members.find((member) => member.uuid === memberData?.user.minecraftUuid)) {
      interaction.reply({ content: "You are not in calm guild!", ephemeral: true });
      return;
    }

    const modal = new ModalBuilder();
    const textInput = new TextInputBuilder().setLabel("What is your reason for inactivity").setStyle(TextInputStyle.Paragraph).setMaxLength(500).setCustomId("reason");
    modal.setTitle("Gexp Immunity").addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(textInput)).setCustomId(`submitInactiveRequest_${interaction.values[0]}`);

    interaction.showModal(modal);
  },
  validator: (interaction) => interaction.customId.toLowerCase() === "showinactivitymodal",
  ensureMemberDataExists: true,
};

export default interaction;
