require('dotenv').config();
import { Event } from "../helpers/event";

export const interactionCreate: Event = {
    name: "interactionCreate",
    once: true,
    async execute(_commands, commandCollection, interaction) {
        if(!interaction.isCommand()) return;
        const command = commandCollection.get(interaction.commandName);
        if(!command) return;
    
        try{
            await command.execute(interaction);
        } catch (e) {
            if(e) console.error(e);
    
            await interaction.reply({
                content: "Something went wrong!",
                emphemeral: true
            });
        } 
    }

}