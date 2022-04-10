
import {Client, Collection, Intents} from 'discord.js';
//Importing command and event imports
import * as commandImports from './commands';
import * as eventImports from './events';
import { Command } from './helpers/command';
import { config } from './utils/config';
import { logger } from './utils/logger';


// Creating a new client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

logger.info("Starting up...");

// Loading in the command list
// commandList is a JSON array of commands for registration
// commandCollection is a discord.js Collection of commands for interactionCreate
logger.debug("Registering commands...");
const commandList = [];
const commandCollection = new Collection<string,Command>();
for (const command of Object.values(commandImports)) {
    logger.trace(`Registering command: ${command.name}`);
    commandList.push(command.data.toJSON());
    commandCollection.set(command.data.name, command);
}

// Loading the events
for (const event of Object.values(eventImports)) {
    logger.trace(`Registering event: ${event.name}`);
    // Seperating events that should only be called once from those that should be called every time
    if(event.once){
        client.once(event.name, (...args) => event.execute(commandList, commandCollection, ...args));
    }else{
        client.on(event.name, (...args) => event.execute(commandList, commandCollection, ...args));
    }
}


// Logging in
// Check if token is valid
if(!config.TOKEN){
    logger.error("Token is not valid!");
    process.exit(1);
}
try{
    client.login(config.TOKEN);
    logger.info("Logged in!");
}catch (e) {
    logger.fatal(`Error encountered at login: ${e}`);
}

