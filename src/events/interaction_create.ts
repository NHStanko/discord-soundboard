import { logger } from '../utils/logger';
import { Event } from "../helpers/event";

export const interactionCreate: Event = {
    name: "interactionCreate",
    once: false,
    async execute(_commands, commandCollection, interaction) {
        if(!interaction.isCommand()){
            logger.trace(`Non-command interaction detected: ${interaction.message}`);
            return;
        }
            
        const command = commandCollection.get(interaction.commandName);
        if(!command){
            logger.warn(`Command not found: ${interaction.commandName} - ${interaction.message}`);
            return;
        }

        try{
            await command.execute(interaction);
            logger.info(`Command executed: ${interaction.commandName} - ${interaction.message}`);
        } catch (e) {
            if(e) logger.error(`Error encountered at command execution:${interaction.commandName} - ${interaction.message} - ${e}`);
    
            await interaction.reply({
                content: "Something went wrong!",
                emphemeral: true
            });
        }
    }

}