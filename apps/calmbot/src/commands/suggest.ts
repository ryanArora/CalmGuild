import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js";
import { CommandData } from "../client/command";
import { Colors } from "discord.js";

const command: CommandData = {
  run(client, message) {
    const button = new ButtonBuilder().setCustomId("showSuggesitonModal").setLabel("Create Suggestion").setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button);

    const embed = new EmbedBuilder().setDescription(`Create a suggestion for ${message.guild.name}`).setColor(Colors.Blurple);

    message.reply({ embeds: [embed], components: [row] });
  },
  usage: "suggest",
};

export default command;
