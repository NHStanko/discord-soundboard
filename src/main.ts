import { Command } from "./commands/interfaces";
import config from "./config";
import log from "./log";
import { Client, Collection, Intents } from "discord.js";
import fs from "fs";
import path from "path";

interface ClientWithCommands extends Client {
  commands?: Collection<string, Command>;
}

const client: ClientWithCommands = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

export default client;

/**
 * Perform the login step for the bot.
 */
async function login(): Promise<void> {
  if (config.TOKEN === undefined || config.TOKEN === "") {
    log.fatal("No token provided");
  }

  await client
    .login(config.TOKEN)
    .catch((e) => {
      log.fatal(e, "Error encountered during login");
    })
    .then(() => {
      log.debug("Login successful!");
    });
}

/**
 * Runs the bot.
 */
async function main(): Promise<void> {
  // Set client commands
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync(path.resolve("src/commands"))
    .filter((file) => !file.endsWith("interfaces.ts"));

  for (const file of commandFiles) {
    log.trace(`Parsing command in ${file}`);
    // Note: the exported command MUST be named 'command'
    // TODO figure out how prevent this requirement
    const { command } = await import(`./commands/${file}`);
    log.trace(command, "Setting command");
    client.commands.set(command.name, command);
  }

  // Register event listeners in the client
  const eventFiles = fs
    .readdirSync(path.resolve("src/events"))
    .filter((file) => !file.endsWith("interfaces.ts"));

  for (const file of eventFiles) {
    log.trace(`Parsing event in ${file}`);
    // Note: the exported event MUST be named 'event'
    const { event } = await import(`./events/${file}`);
    log.trace(event, "Registering events");
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  await login();
}

process.on("SIGTERM", () => {
  log.trace("Received SIGTERM");
  log.info("Stopping bot");
  client.destroy();
});

main();
