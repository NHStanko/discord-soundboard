"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const discord_js_1 = require("discord.js");
//Importing command and event imports
const commandImports = require("./commands");
const eventImports = require("./events");
// Creating a new client
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES
    ]
});
// Loading in the command list
// commandList is a JSON array of commands for registration
// commandCollection is a discord.js Collection of commands for interactionCreate
let commandList = [];
let commandCollection = new discord_js_1.Collection();
for (const command of Object.values(commandImports)) {
    commandList.push(command.data.toJSON());
    commandCollection.set(command.data.name, command);
}
// Loading the events
for (const event of Object.values(eventImports)) {
    // Seperating events that should only be called once from those that should be called every time
    if (event.once) {
        client.once(event.name, (...args) => event.execute(commandList, commandCollection, ...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(commandList, commandCollection, ...args));
    }
}
// Logging in
client.login(process.env.BOT_TOKEN);
//# sourceMappingURL=main.js.map