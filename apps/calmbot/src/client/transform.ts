import { Command } from "./command";
import { RegisteredButtonInteraction, RegisteredContextMenuInteraction, RegisteredModalSubmitInteraction, RegisteredSelectMenuInteraction } from "./interactions";
import { Client, Collection } from "discord.js";

export interface ClientExtensions {
  commands: Collection<string, Command>;
  disabledCommands: Collection<string, string[]>; // K = guildId, V = commandNames

  buttons: RegisteredButtonInteraction[];
  selectMenus: RegisteredSelectMenuInteraction[];
  modals: RegisteredModalSubmitInteraction[];
  contextMenus: RegisteredContextMenuInteraction[];
}

export const transformClient = (client: Client) => {
  const ext: ClientExtensions = {
    commands: new Collection(),
    disabledCommands: new Collection(),
    buttons: [],
    selectMenus: [],
    modals: [],
    contextMenus: [],
  };
  Object.assign(client, ext);
};
