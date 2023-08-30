import { ActionRowBuilder, Colors, EmbedBuilder, MessageActionRowComponentBuilder, MessageCreateOptions, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import getNextDate, { DayOfWeek, TimeOfDay } from "./getNextDate";

export default (): MessageCreateOptions => {
  const embed = new EmbedBuilder()
    .setTitle("Go Inactive")
    .setDescription("Temporary exemption from guild xp requirements.\n\nPlease __select the amount of time you will need be inactive for below.__\nIf more time is needed, please contact staff.")
    .setColor(Colors.Red);

  const timeOfDay: TimeOfDay = { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 };
  const oneWeek = getNextDate(new Date(Date.now()), DayOfWeek.Sunday, timeOfDay);
  const twoWeeks = getNextDate(oneWeek, DayOfWeek.Sunday, timeOfDay);
  const threeWeeks = getNextDate(twoWeeks, DayOfWeek.Sunday, timeOfDay);
  const fourWeeks = getNextDate(threeWeeks, DayOfWeek.Sunday, timeOfDay);

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`showInactivityModal`)
    .addOptions([
      new StringSelectMenuOptionBuilder({ label: `Until ${dateString(oneWeek)} (month/day)`, value: oneWeek.getTime().toString() }),
      new StringSelectMenuOptionBuilder({ label: `Until ${dateString(twoWeeks)} (month/day)`, value: twoWeeks.getTime().toString() }),
      new StringSelectMenuOptionBuilder({ label: `Until ${dateString(threeWeeks)} (month/day)`, value: threeWeeks.getTime().toString() }),
      new StringSelectMenuOptionBuilder({ label: `Until ${dateString(fourWeeks)} (month/day)`, value: fourWeeks.getTime().toString() }),
    ]);

  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(selectMenu);
  return { embeds: [embed], components: [row] };
};

const dateString = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
