"use strict";
// Adding in requirements
require('dotenv').config();
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
// Creating a new client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});
// Loading in the command files
const commandFiles = fs
    .readdirSync('./src/commands')
    .filter(file => file.endsWith('.ts'));
// Create new collection for commands
const commands = [];
client.commands = new Collection();
// Import commands into collection
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    commandFiles.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}
// Loading in the events
const eventFiles = fs
    .readdirSync('./src/events')
    .filter(file => file.endsWith('.ts'));
// Import events into collection
for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args, commands));
    }
}
client.login(process.env.BOT_TOKEN);
//# sourceMappingURL=main.js.map