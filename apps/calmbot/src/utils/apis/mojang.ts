import axios from "axios";
import { Collection } from "discord.js";

const uuidFromNameCache: Collection<string, string> = new Collection();

export default function getUUIDFromName(name: string): Promise<string | null> {
  return new Promise((resolve) => {
    const cached = uuidFromNameCache.get(name.toLowerCase());
    if (cached) resolve(cached);

    axios
      .get(`https://api.mojang.com/users/profiles/minecraft/${name}`)
      .then((res) => {
        if (res.data?.id) {
          uuidFromNameCache.set(name, res.data.id);
          setTimeout(() => uuidFromNameCache.delete(name), 1000 * 60 * 15); // 15 minute timeout

          resolve(res.data.id);
        }
        resolve(null);
      })
      .catch(() => resolve(null));
  });
}

export interface MojangProfile {
  id: string;
  name: string;
}

export const getProfileFromUUID = (uuid: string): Promise<MojangProfile | null> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
      .then((res) => {
        resolve(res.data ?? null);
      })
      .catch(reject);
  });
};
