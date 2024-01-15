// Q: Why the fuck did i do it like this
// A: its a bunch of image links that dont change so it is perfectly acceptable to do this

import { Client, Message } from "discord.js";
import { CommandData } from "../client/command";

export const imagesCommandExecutor = (images: string[]): CommandData["run"] => {
  return (client: Client, message: Message) => {
    message.reply({ content: images[Math.floor(Math.random() * images.length)] });
  };
};

export const Arlo = [
  "https://media.discordapp.net/attachments/805506062127857707/1189710264375984158/image.png?ex=659f2706&is=658cb206&hm=3be877332a12e3a21bcdc59f08f08cb928ddd02424d6c060a929b4362d6c1207&=&format=webp&quality=lossless&width=506&height=453",
];
export const Whiskey = [
  "https://media.discordapp.net/attachments/805506062127857707/1189710264375984158/image.png?ex=659f2706&is=658cb206&hm=3be877332a12e3a21bcdc59f08f08cb928ddd02424d6c060a929b4362d6c1207&=&format=webp&quality=lossless&width=506&height=453",
];

export const Aida = [
  "https://media.discordapp.net/attachments/805506062127857707/1196552029552779426/image.png?ex=65b80aea&is=65a595ea&hm=e8fc4e8f1587b46f5048bd03db4fb652b91bb3e5ae3078120c0fa019b3ce07e7&=&format=webp&quality=lossless&width=1435&height=1035"
];
