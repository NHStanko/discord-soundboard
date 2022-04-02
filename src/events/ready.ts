const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require('dotenv').config();
import { Event } from "../helpers/event";

export const ready: Event = {
    name: "ready",
    once: true,
    execute: async (commandList, _commandCollection, client) => {
        // On ready execution
        console.log("Ready!");

        const CLIENT_ID = client.user.id;

        const rest = new REST({
            version: "9",
        }).setToken(process.env.BOT_TOKEN);

        // Registering the commands
        (async () => {
            try{
                // production enviroments to only one server roll out instantly
                if(process.env.ENV === "production"){
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commandList
                    });
                    console.log("Registered commands globally!");
                }else{
                    // development enviroments to multiple servers roll out over an hour so it is not suggest for development
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: commandList
                    });
                    console.log("Registered commands globally!");
                }
            } catch (e) {
                if(e) console.error(e);
            }

        })();
    }
};