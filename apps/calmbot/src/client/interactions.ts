import { ButtonInteraction, Client, ContextMenuCommandBuilder, ContextMenuCommandInteraction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import fs from "fs";
import path from "path";

export interface BaseRegisteredInteraction<T> {
  execute: (client: Client, interaction: T) => void;
  ensureMemberDataExists?: boolean;
}

export interface RegisteredComponentInteraction<T> extends BaseRegisteredInteraction<T> {
  validator: (interaction: T) => boolean;
}

export interface RegisteredCommandInteraction<T, B> extends BaseRegisteredInteraction<T> {
  data: B; // for the builder (ContextMenuCommandbuilder, SlashCommandBuilder etc)
}

// Non Commands
export type RegisteredModalSubmitInteraction = RegisteredComponentInteraction<ModalSubmitInteraction>;
export type RegisteredSelectMenuInteraction = RegisteredComponentInteraction<SelectMenuInteraction>;
export type RegisteredButtonInteraction = RegisteredComponentInteraction<ButtonInteraction>;

// Commands
export type RegisteredContextMenuInteraction = RegisteredCommandInteraction<ContextMenuCommandInteraction, ContextMenuCommandBuilder>;

export const registerInteractions = (client: Client, interactionDirectory: string) => {
  const files = fs.readdirSync(interactionDirectory);

  for (const file of files) {
    const fileName = file.toLowerCase();

    const stats = fs.statSync(path.join(interactionDirectory, file));
    if (!stats.isDirectory()) continue;

    const interactionFiles = fs.readdirSync(path.join(interactionDirectory, file));
    for (const interactionFile of interactionFiles) {
      const interactionFileStats = fs.statSync(path.join(interactionDirectory, file, interactionFile));

      if (!interactionFileStats.isFile() || !interactionFile.endsWith(".js")) continue;

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const interaction: BaseRegisteredInteraction<unknown> = require(path.join(interactionDirectory, file, interactionFile)).default;

      switch (fileName) {
        case "buttons":
          client.buttons.push(interaction as RegisteredButtonInteraction);
          break;
        case "selectmenus":
          client.selectMenus.push(interaction as RegisteredSelectMenuInteraction);
          break;
        case "modals":
          client.modals.push(interaction as RegisteredModalSubmitInteraction);
          break;
        case "contextmenus":
          client.contextMenus.push(interaction as RegisteredContextMenuInteraction);
          break;
      }
    }
  }
};
