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
  "https://media.discordapp.net/attachments/615218413626720257/1179947173526384720/IMG_3958.png?ex=657ba270&is=65692d70&hm=e465ba3abcde9446e4900a6faca82c77c97068151c8b6660b572dba7aff53432&=&format=webp&quality=lossless&width=588&height=682",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947173899673641/IMG_3957.png?ex=657ba270&is=65692d70&hm=9e9d3f669759d0950c771d9408c0cc5d1a052cb0c510540bf20c8b688d533e37&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947174373638184/IMG_3956.png?ex=657ba270&is=65692d70&hm=dad0c79acf7ee297992da5dfe5bec6cb9fd9c840a38754e2da318d14e3e6698e&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947174725955646/IMG_3955.png?ex=657ba270&is=65692d70&hm=2af211bc820a7f9aba149a827243c70e520b3be849e9dc08989a3856ef62f421&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947175053107331/IMG_3954.png?ex=657ba270&is=65692d70&hm=46aab6ec11f2e06e6171499cb695319c57441fe16acae603aaab45e930ecd551&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947175615152168/IMG_3953.png?ex=657ba271&is=65692d71&hm=c5a222136b40dfd389fc6b0332a7ee3481eeb197868a1f0cb40797b74304ef9c&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947175942299648/IMG_3952.png?ex=657ba271&is=65692d71&hm=ae7a32769238b392f50e1ec0c0afcdcc742cf690b7f6a92e0ca2d6694cabdc22&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947176265269298/IMG_3951.png?ex=657ba271&is=65692d71&hm=9f7e11874277dc9b84d26ce7e5aa9409ed274e8d8c3b31e46901332b3035168d&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947176605003866/IMG_3949.png?ex=657ba271&is=65692d71&hm=8471c660acc8c83707507b84596a538c7de95d8bac34b948747455694333d3a0&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947177104121917/IMG_3948.png?ex=657ba271&is=65692d71&hm=fd77d5ec93abf12d297e3d9def7c79cfbbba9e0e0d4073c9db113160196ff9cf&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947197333250078/IMG_3948.png?ex=657ba276&is=65692d76&hm=e86538a1706ce7ae01220304731c3365dade0ee61b9b242522212082aeb19ead&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947197916250185/IMG_3947.png?ex=657ba276&is=65692d76&hm=0c0c4706bfec6ca2b5c485131deb575b1be9ffaa1e84b92041882d27e7b04e4b&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947198243418252/IMG_3946.png?ex=657ba276&is=65692d76&hm=247f0df1433737744dd2b806784dbd120ddaf9ed1635667a9dc4cfd0fcf40916&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947198574764063/IMG_3945.png?ex=657ba276&is=65692d76&hm=44cbc7852cfbaae8b9a534e8988c73d96d662649bd9b266c2e813b8d36b9070b&",
  "https://cdn.discordapp.com/attachments/615218413626720257/1179947199107432580/IMG_3944.png?ex=657ba276&is=65692d76&hm=eb822282906d111d03e91dcd065f59850f91b9b6115a901ef1ff0212819bc350&",
];
