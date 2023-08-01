import { Command } from "./command";
import { RegisteredButtonInteraction, RegisteredContextMenuInteraction, RegisteredModalSubmitInteraction, RegisteredSelectMenuInteraction } from "./interactions";
import { Client, Collection } from "discord.js";

export interface ClientExtensions {
  commands: Collection<string, Command>;

  buttons: RegisteredButtonInteraction[];
  selectMenus: RegisteredSelectMenuInteraction[];
  modals: RegisteredModalSubmitInteraction[];
  contextMenus: RegisteredContextMenuInteraction[];
}

export const transformClient = (client: Client) => {
  const ext: ClientExtensions = {
    commands: new Collection(),
    buttons: [],
    selectMenus: [],
    modals: [],
    contextMenus: [],
  };
  Object.assign(client, ext);
};
