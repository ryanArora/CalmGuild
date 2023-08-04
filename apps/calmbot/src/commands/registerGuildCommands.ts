import { ContextMenuCommandBuilder, REST, Routes } from "discord.js";
import path from "path";
import { CommandData } from "../client/command";
import fs from "fs";

const command: CommandData = {
  run: async (client, message) => {
    if (!message.guild || !client.application) return;

    const dir = path.join(__dirname, "../interactions/contextMenus");
    const commands: ContextMenuCommandBuilder[] = [];

    for (const file of fs.readdirSync(dir).filter((file) => file.endsWith(".js") || file.endsWith(".ts"))) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const data = require(path.join(dir, file)).default.data.toJSON();

      commands.push(data);
    }

    if (!client.token) {
      console.log("Token not found");
      return;
    }

    const rest = new REST({ version: "9" }).setToken(client.token);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(client.application.id, message.guild.id), { body: commands });

      console.log("Successfully reloaded application (/) commands.");
      message.reply("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  },
  requiredPermission: "Administrator",
  usage: "registerGuildCommands",
};

export default command;
