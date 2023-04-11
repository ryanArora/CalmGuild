import { Message, ActionRowBuilder, ComponentType, MessageActionRowComponentBuilder } from "discord.js";

export default (message: Message): Promise<Message> => {
  return new Promise((resolve, reject) => {
    const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
    for (const row of message.components) {
      const newRow: ActionRowBuilder<MessageActionRowComponentBuilder> = ActionRowBuilder.from(row);
      newRow.components.map((component) => {
        if (component.data.type === ComponentType.Button) component.data.disabled = true;
        return component;
      });

      rows.push(newRow);
    }

    message.edit({ components: rows }).then(resolve).catch(reject);
  });
};
