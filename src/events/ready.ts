const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { Event } from "../helpers/event";

export const ready: Event = {
    name: "ready",
    once: true,
    execute: async (commandList, _commandCollection, client) => {
        logger.debug("Starting registration of commands...");

        const CLIENT_ID = client.user.id;

        const rest = new REST({
            version: "9",
        }).setToken(config.TOKEN);

        // Registering the commands
        (async () => {
            try{
                // production enviroments to only one server roll out instantly
                if(config.NODE_ENV === "production"){
                    logger.debug("Production enviroment detected, registering to one server only.");
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commandList
                    });
                }else{
                    // development enviroments to multiple servers roll out over an hour so it is not suggest for development
                    logger.debug("Development enviroment detected, registering to all servers.");
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: commandList
                    });
                }
            } catch (e) {
                if(e) logger.error(`Error encountered at registration:${e}`);
            }

        })();
    }
};