import { client as database } from "database";
import { RoleType } from "database";
import { Guild, Role } from "discord.js";

export default (roleType: RoleType, guild: Guild): Promise<Role | undefined> => {
  return new Promise(async (resolve) => {
    const roleData = await database.role.findFirst({
      where: {
        roleType: roleType,
        guildId: guild.id,
      },
      select: {
        roleId: true,
      },
    });

    if (!roleData) return resolve(undefined);
    const role = guild.roles.cache.get(roleData?.roleId);
    resolve(role);
  });
};
