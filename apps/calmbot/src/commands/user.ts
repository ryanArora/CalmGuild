import getMinecraftProfile from "../utils/getMinecraftProfile";
import getUserFromInput from "../utils/getUserFromInput";
import { client as database } from "database";
import { APIEmbedField, CommandData, EmbedBuilder } from "discord.js";

const command: CommandData = {
  run: async (client, message, args) => {
    if (!message.guild || !args[0]) return;
    const user = await getUserFromInput(client, args[0]);
    if (!user) {
      message.reply("Couldn't find user");
      return;
    }

    const userData = await database.user.findFirst({
      where: { discordId: user.id },
      select: { minecraftUuid: true },
    });
    let minecraftName: string | undefined = undefined;

    if (userData && userData.minecraftUuid) {
      const name = await getMinecraftProfile(userData.minecraftUuid, ["MINECRAFT_UUID"]);
      if (name) minecraftName = name.name;
    }

    const embedFields: APIEmbedField[] = [
      { name: "Minecraft Name", value: minecraftName ?? "N/A (not linked)" },
      {
        name: "Minecraft UUID",
        value: userData?.minecraftUuid ?? "N/A (not linked)",
      },
      { name: "Discord Id", value: user.id },
    ];

    const embed = new EmbedBuilder();
    embed.setDescription(`Data for ${user}`);
    embed.addFields(embedFields);

    message.reply({ embeds: [embed] });
  },
  requiredPermission: "STAFF",
  minimumArguments: 1,
  usage: "user <person>",
};

export default command;
