import { Client, Collection, Intents } from "discord.js";
import * as commands from "./commands";
import { Command } from "./commands";
import * as events from "./events";
import { config } from "./utils/config";
import { log } from "./utils/logger";

export const client: Client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

async function main() {
  // Creating a new client
  log.info("Starting up...");

  // Loading in the command list
  // commandList is a JSON array of commands for registration
  // commandCollection is a discord.js Collection of commands for interactionCreate
  log.debug("Registering commands...");
  const commandList = [];
  const commandCollection = new Collection<string, Command>();
  for (const command of Object.values(commands)) {
    log.trace(`Registering command: ${command.name}`);
    commandList.push(command.data.toJSON());
    commandCollection.set(command.data.name, command);
  }

  // Loading the events
  for (const event of Object.values(events)) {
    log.trace(`Registering event: ${event.name}`);
    // Seperating events that should only be called once from those that should be called every time
    if (event.once) {
      client.once(event.name, (...args) =>
        event.execute(commandList, commandCollection, ...args)
      );
    } else {
      client.on(event.name, (...args) =>
        event.execute(commandList, commandCollection, ...args)
      );
    }
  }

  // Logging in
  // Check if token is valid
  if (!config.TOKEN) {
    log.error(new Error("Token is not valid!"));
    process.exit(1);
  }

  try {
    await client.login(config.TOKEN).then(
      () => {
        log.debug("Logged in!");
      },
      () => {
        log.fatal("Failed to log in");
      }
    );
    client.once("ready", () => {
      log.info("Running");
    });
  } catch (e) {
    log.fatal(e, "Error encountered at login");
  }
}

// TODO: Add event listener to call client.destroy() when shutting down
main();
