import { registerCommands } from "./client/command";
import { registerEvents } from "./client/events";
import { registerInteractions } from "./client/interactions";
import { transformClient } from "./client/transform";
import startTasks from "./utils/startTasks";
import { Client, IntentsBitField, Partials } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import invariant from "tiny-invariant";

process.on("unhandledException", console.error);
process.on("unhandledRejection", console.error);

dotenv.config();
invariant(process.env.BOT_TOKEN, "BOT_TOKEN env variable not defined");

const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildMessageReactions } = IntentsBitField.Flags;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildMessageReactions],
  partials: [Partials.Reaction, Partials.Message, Partials.Channel],
});

transformClient(client);

registerCommands(client, path.join(__dirname, "commands"));
registerEvents(client, path.join(__dirname, "events"));
registerInteractions(client, path.join(__dirname, "interactions"));

startTasks(client, path.join(__dirname, "tasks"));

client.login(process.env.BOT_TOKEN);
