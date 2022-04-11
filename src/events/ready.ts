import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "../utils/config";
import { log } from "../utils/logger";
import { Event } from "./interfaces";

export const ready: Event = {
  name: "ready",
  once: true,
  execute: async (commandList, _commandCollection, client) => {
    log.debug("Starting registration of commands...");

    const CLIENT_ID = client.user.id;

    const rest = new REST({
      version: "9",
    }).setToken(config.TOKEN);

    // Registering the commands
    (async () => {
      try {
        // production enviroments to only one server roll out instantly
        if (config.NODE_ENV === "production") {
          log.debug(
            "Production enviroment detected, registering to one server only."
          );
          await rest
            .put(Routes.applicationCommands(CLIENT_ID), {
              body: commandList,
            })
            .then(() => {
              log.debug("Registered to server");
            });
        } else {
          // development enviroments to multiple servers roll out over an hour so it is not suggest for development
          log.debug(
            "Development enviroment detected, registering to all servers."
          );
          await rest
            .put(Routes.applicationGuildCommands(CLIENT_ID, config.GUILD_ID), {
              body: commandList,
            })
            .then(() => {
              log.debug("Registered to all servers");
            });
        }
      } catch (e) {
        log.error(e, "Error encountered at registration");
      }
    })();
  },
};
