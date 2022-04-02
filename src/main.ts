
require('dotenv').config();
import {Client, Collection, Intents} from 'discord.js';
//Importing command and event imports
import * as commandImports from './commands';
import * as eventImports from './events';
import { Command } from './helpers/command';
// Creating a new client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});



// Loading in the command list
// commandList is a JSON array of commands for registration
// commandCollection is a discord.js Collection of commands for interactionCreate
const commandList = [];
const commandCollection = new Collection<string,Command>();
for (const command of Object.values(commandImports)) {
    commandList.push(command.data.toJSON());
    commandCollection.set(command.data.name, command);
}

// Loading the events
for (const event of Object.values(eventImports)) {
    // Seperating events that should only be called once from those that should be called every time
    if(event.once){
        client.once(event.name, (...args) => event.execute(commandList, commandCollection, ...args));
    }else{
        client.on(event.name, (...args) => event.execute(commandList, commandCollection, ...args));
    }
}

// Checking if the token is set
if(!process.env.TOKEN){
    console.error("No token found, please set TOKEN in .env");
    process.exit(1);
}

// Checking if development mode is set and no GUILD_ID is set
if(process.env.NODE_ENV=='development' && !process.env.GUILD_ID){
    console.error("Development mode is set but no GUILD_ID is set, please set GUILD_ID in .env");
    process.exit(1);
}

// Logging in
client.login(process.env.BOT_TOKEN);
