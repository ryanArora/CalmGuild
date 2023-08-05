import getUserFromInput from "../utils/getUserFromInput";
import { client as database } from "database";
import { CommandData } from "discord.js";
import getMinecraftProfile from "../utils/getMinecraftProfile";

const command: CommandData = {
  run: async (client, message, args) => {
    if (!message.guild || !args[0]) return;

    const discordUser = await getUserFromInput(client, args[0], ["DISCORD_ID", "DISCORD_MENTION"]);
    if (!discordUser) {
      message.reply("Couldn't find discord user");
      return;
    }

    const userDataFromDiscord = await database.user.findFirst({
      where: { discordId: discordUser.id },
      select: { minecraftUuid: true },
    });

    if (userDataFromDiscord?.minecraftUuid) {
      message.reply("This user is already linked");
      return;
    }

    const minecraftProfile = await getMinecraftProfile(args[1]);
    if (!minecraftProfile) {
      message.reply("Couldn't find that minecraft account");
      return;
    }

    const userDataFromMinecraft = await database.user.findFirst({ where: { minecraftUuid: minecraftProfile.id }, select: { discordId: true } });
    if (userDataFromMinecraft) {
      message.reply(`User (id: ${userDataFromMinecraft.discordId}) is already linked using that minecraft account`);
      return;
    }

    database.user
      .upsert({
        where: { discordId: discordUser.id },
        create: { discordId: discordUser.id, minecraftUuid: minecraftProfile.id },
        update: { minecraftUuid: minecraftProfile.id },
      })
      .then(() => {
        message.reply("Account linked!");
      })
      .catch((err) => {
        console.error(err);
        message.reply("Error linking.");
      });
  },
  requiredPermission: "STAFF",
  minimumArguments: 2,
  usage: "unlink <discord> <minecraft>",
};

export default command;
