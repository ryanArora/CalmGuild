import { CommandData, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from "discord.js";

const ticketReasons = ["Questions", "Punishment Appeals", "Reporting Users", "Claiming Giveaways", "Bug Reports", "Scheduling Events"].map((reason) => `• **${reason}**\n`).join("");

const command: CommandData = {
  run: async (client, message) => {
    if (!message.guild) return;

    const button = new ButtonBuilder().setCustomId("showTicketModal").setLabel("Open Ticket").setStyle(ButtonStyle.Success).setEmoji("✉️");
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button);

    message.channel.send({
      components: [row],
      content: `Please click the button below to open a ticket and get private support from staff.\nThis can be for example but __not limited to__\n\n${ticketReasons}`,
    });
  },
  usage: "ticket",
  aliases: ["open"],
};

export default command;
