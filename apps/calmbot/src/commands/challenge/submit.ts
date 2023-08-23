import { CommandData } from "../../client/command";
import { client as database } from "database";
import getImageFromMessage from "../../utils/getImageFromMessage";
import getChannel from "../../utils/getChannel";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageActionRowComponentBuilder, TextChannel } from "discord.js";
import findOrCreateMemberArgs from "../../utils/database/findOrCreateMemberArgs";
const command: CommandData = {
  run: async (client, message, args) => {
    if (!message.guild || !args[0]) return;
    const id = args[0].toLowerCase();

    const challenge = await database.challenge.findUnique({ where: { id_guildId: { id, guildId: message.guild.id } }, select: { displayName: true, submitedChallenges: { where: { memberId: message.author.id }, select: { state: true } } } });
    if (!challenge) {
      message.reply("Invalid challenge id");
      return;
    }

    if (challenge.submitedChallenges[0]) {
      message.reply(`You already ${challenge.submitedChallenges[0].state === "PENDING" ? "submited a request for" : "completed"} this challenge`);
      return;
    }

    const proof = getImageFromMessage(message);
    if (!proof) {
      message.reply("You must attach an image as proof of you completing this challenge.");
      return;
    }

    const submissionChannel = await getChannel("CHALLENGE_SUBMISSIONS", message.guild);
    if (!(submissionChannel instanceof TextChannel)) {
      message.reply("Couldn't find submission channel");
      return;
    }

    await database.user.upsert({ ...findOrCreateMemberArgs(message.author.id, message.guild.id) });
    await database.submitedChallenge.create({ data: { state: "PENDING", challengeId: id, guildId: message.guild.id, memberId: message.author.id } });

    const embed = new EmbedBuilder().setDescription(`Challenge request from ${message.author}`);
    embed.addFields([
      { name: "Challenge name", value: challenge.displayName },
      { name: "Challenge Id", value: id },
    ]);
    embed.setImage(proof);
    const acceptButton = new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Accept").setCustomId(`acceptChallenge_${message.author.id}_${id}`);
    const denyButton = new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Deny").setCustomId(`showChallengeDenyModal_${message.author.id}_${id}`);
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(acceptButton, denyButton);

    submissionChannel.send({ embeds: [embed], components: [row] });
    message.reply("Submitted, you will be informed if it is accepted or denied");
  },
  usage: "challenge submit <id> <attach image of proof>",
  defaultSubcommand: true,
  minimumArguments: 1,
};

export default command;
