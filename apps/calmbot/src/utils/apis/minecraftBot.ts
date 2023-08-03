import axios, { AxiosResponse } from "axios";
import invariant from "tiny-invariant";

const URL = process.env.MINECRAFT_BOT_SERVER_URL;
const KEY = process.env.MINECRAFT_BOT_SERVER_KEY;

export function sendCommand(message: string): Promise<AxiosResponse> {
  invariant(URL, "MINECRAFT_BOT_SERVER_URL env variable not defined");
  invariant(KEY, "MINECRAFT_BOT_SERVER_KEY env variable not defined");

  return new Promise((resolve, reject) => {
    axios
      .post(URL, { key: KEY, message: message })
      .then((res) => {
        if (res.status === 200) resolve(res);
        reject(res);
      })
      .catch(reject);
  });
}
