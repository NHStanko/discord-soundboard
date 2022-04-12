import config from "../config";
import log from "../log";
import client from "../main";
import { Event } from "./interfaces";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import fs from "fs";
import path from "path";

async function deployCommands(): Promise<void> {
  const commands = [];
  const commandFiles = fs
    .readdirSync(path.resolve("src/commands"))
    .filter((file) => !file.endsWith("interfaces.ts"));

  for (const file of commandFiles) {
    // Note: the exported command MUST be named 'command'
    const { command } = await import(`../commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(config.TOKEN);

  if (config.NODE_ENV === "production") {
    log.debug("NODE_ENV is production, deploying to a single server");
    // Deploy to a single server for production since deployments are instant
    rest
      .put(Routes.applicationCommands(client.user.id), {
        body: commands,
      })
      .then(() => {
        log.trace("Successfully registered application commands");
      })
      .catch((e) => {
        log.error(e, "Failed to register application commands");
      });
  } else {
    log.debug("NODE_ENV is development, deploying to guild");
    // Deploy to a full guild only during development since deployments are slow
    rest
      .put(Routes.applicationGuildCommands(client.user.id, config.GUILD_ID), {
        body: commands,
      })
      .then(() => {
        log.trace("Successfully registered application guild commands");
      })
      .catch((e) => {
        log.error(e, "Failed to register application commands");
      });
  }
}

export const event: Event = {
  name: "ready",
  once: true,
  execute: async (interaction) => {
    log.info(`Ready! Logged in as ${interaction.user.tag}`);
    await deployCommands();
  },
};
