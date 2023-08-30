import { CommandData } from "../../client/command";
import getRole from "../../utils/getRole";
import getUserFromInput from "../../utils/getUserFromInput";
import { client as database } from "database";

const command: CommandData = {
  run: async (client, message, args) => {
    const user = await getUserFromInput(client, args[0]);
    if (!user) {
      message.reply("Couldn't find that user");
      return;
    }

    const memberData = await database.member.findUnique({ where: { guildId_discordId: { guildId: message.guildId, discordId: user.id }, currentlyInactive: true }, select: { inactivePending: true } });
    if (!memberData) {
      message.reply("User is not inactive");
      return;
    }

    await database.member.update({ where: { guildId_discordId: { guildId: message.guildId, discordId: user.id } }, data: { currentlyInactive: false } });

    message.guild.members
      .fetch(user.id)
      .then(async (member) => {
        const role = await getRole("INACTIVE", member.guild);
        if (role) member.roles.remove(role);
      })
      .catch();

    message.reply("Done");
  },
  usage: "inactive remove <user>",
  minimumArguments: 1,
  requiredPermission: "STAFF",
};

export default command;
