import { client as database } from "database";
import { APIEmbedField, EmbedBuilder, Colors } from "discord.js";
import { getGuild } from "./apis/hypixel";
import getMinecraftProfile from "./getMinecraftProfile";

export default (userId: string): Promise<EmbedBuilder> => {
  return new Promise(async (resolve) => {
    const userData = await database.user.findFirst({
      where: { discordId: userId },
      select: { minecraftUuid: true },
    });
    let minecraftName: string | undefined = undefined;

    let inHypixelGuild = false;
    if (userData && userData.minecraftUuid) {
      const hypixelGuild = await getGuild("Calm").catch(console.error);
      inHypixelGuild = hypixelGuild?.members.find((member) => member.uuid === userData.minecraftUuid) ? true : false;

      const name = await getMinecraftProfile(userData.minecraftUuid, ["MINECRAFT_UUID"]);
      if (name) minecraftName = name.name;
    }

    const embedFields: APIEmbedField[] = [
      { name: "Minecraft Name", value: minecraftName ?? "N/A (not linked)" },
      {
        name: "Minecraft UUID",
        value: userData?.minecraftUuid ?? "N/A (not linked)",
      },
      {
        name: "In Guild (hypixel)",
        value: inHypixelGuild ? "Yes" : "No",
      },
      { name: "Discord Id", value: userId },
    ];

    const embed = new EmbedBuilder().setColor(Colors.Blurple);
    embed.setDescription(`Data for <@${userId}>`);
    embed.addFields(embedFields);

    resolve(embed);
  });
};
