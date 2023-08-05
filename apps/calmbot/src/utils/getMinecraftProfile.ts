import getUUIDFromName, { MojangProfile, getProfileFromUUID } from "./apis/mojang";
import isProperMinecraftUsername from "./regex/isProperMinecraftUsername";

type InputTypes = "MINECRAFT_USERNAME" | "MINECRAFT_UUID";

export default (input: string, inputType: InputTypes[] = ["MINECRAFT_USERNAME", "MINECRAFT_UUID"]): Promise<MojangProfile | undefined> => {
  return new Promise(async (resolve) => {
    if (inputType.includes("MINECRAFT_USERNAME") && isProperMinecraftUsername(input)) {
      const uuid = await getUUIDFromName(input);
      if (!uuid) return resolve(undefined);

      resolve({ id: uuid, name: input });
    } else if (inputType.includes("MINECRAFT_UUID")) {
      const profile = await getProfileFromUUID(input);
      if (!profile) return resolve(undefined);

      return resolve(profile);
    }

    resolve(undefined);
  });
};
