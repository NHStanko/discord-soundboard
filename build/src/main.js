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
fs.readdir(__dirname, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file);
    });
});
// Loading in the command files
const commandFiles = fs
    .readdirSync('src/commands')
    .filter(file => file.endsWith('.ts'));
// Create new collection for commands
const commands = [];
client.commands = new Collection();
// Import commands into collection
for (const file of commandFiles) {
    const command = require(`src/commands/${file}`);
    commandFiles.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}
// Loading in the events
console.log(process.cwd());
const eventFiles = fs
    .readdirSync('events')
    .filter(file => file.endsWith('.js'));
// Import events into collection
for (const file of eventFiles) {
    const event = require(`./events/${file.replace('.ts', '.js')}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args, commands));
    }
}
client.login(process.env.BOT_TOKEN);
//# sourceMappingURL=main.js.map