import { Collection, Colors, Embed } from "discord.js";
import { Command, CommandData } from "../client/command";
import { EmbedBuilder } from "@discordjs/builders";

const command: CommandData = {
  run: async (client, message, args) => {
    const specificCommand = args[0]?.toLowerCase();
    const embed = new EmbedBuilder().setColor(Colors.Blurple);

    if (!specificCommand) {
      const adminCommands = client.commands.filter((command) => command.requiredPermission === "Administrator");
      const staffCommands = client.commands.filter((command) => command.requiredPermission === "STAFF");
      const otherCommands = client.commands.filter((command) => command.requiredPermission !== "STAFF" && command.requiredPermission !== "Administrator");

      embed.setTitle("Commands List");
      embed.addFields([
        { name: "Admin", value: formatCommands(adminCommands) },
        { name: "Staff", value: formatCommands(staffCommands) },
        { name: "General", value: formatCommands(otherCommands) },
      ]);

      embed.setFooter({ text: "Run c!help <commandName> to get information about a specific command" });
    } else {
      const command = client.commands.get(specificCommand);
      if (!command) {
        message.reply("Couldn't find that command. Run c!help to list all commands");
        return;
      }

      embed.setTitle(`Information for c!${specificCommand}`);
      embed.setFooter({ text: "Run c!help to view all commands" });
      if (command.type === "COMMAND") {
        embed.addFields([
          { name: "Usage", value: `c!${command.usage}` },
          { name: "Permission Required", value: command.requiredPermission?.toString() ?? "Everyone" },
          {
            name: "Aliases",
            value: command.aliases
              ? command.aliases
                  .map((alias) => `\`${alias}\`,`)
                  .join(" ")
                  .slice(0, -1)
              : "`none`",
          },
        ]);
      } else {
        embed.setDescription(`\`\`\`${command.subcommands?.map((data) => `c!${data.usage}`).join("\n")}\`\`\``);
      }
    }

    message.reply({ embeds: [embed] });
  },
  usage: "help <commandName>",
};

export default command;

const formatCommands = (commands: Collection<string, Command>) => `\`\`\`${commands.map((data, name) => `c!${name}`).join("\n")}\`\`\``;
