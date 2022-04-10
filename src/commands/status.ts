import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { Command } from "../helpers/command"
import { client } from "../main";
import { logger } from "../utils/logger";

// Create an instance of the command using the Command Interface
export const status: Command = {
    // Execute happens on the command
    name: "status",
    execute: async (interaction) => {
        // Check if url string is youtube or twitch link
        const url = interaction.options.getString("url");
        // Check if url is a youtube or twitch link
        if(url){
            if(!(interaction.options.getString("type") === "streaming")){
                interaction.reply({
                    content: "Can only include a url if you are streaming!",
                    ephemeral: true
                });
                return;
            }else if(!(url.includes("youtube.com") || url.includes("twitch.tv"))){ 
                interaction.reply({
                    content: "Invalid url! Include twitch or youtube link",
                    ephemeral: true
                });
                return;
            }   
        }

        try{
            const output = client.user.setActivity({
                    name: interaction.options.getString("activity"),
                    type: interaction.options.getString("type"),
                    url: interaction.options.getString("url")
        });
        logger.debug(output);
        } catch (e) {
            if(e) logger.error(`Error encountered at command execution:${interaction.commandName} - ${interaction.message} - ${e}`);
        }


        interaction.reply({
            content: "Set Status!",
            ephemeral: true
        });
    },
    // Slash command builder contains the command name and description
    data: new SlashCommandBuilder()
            .setName("status")
            .setDescription("Change the status of the bot")
            .addStringOption(option => option
                    .setName("type")
                    .setDescription("The type of the bot will be doing")
                    .setRequired(true)
                    .addChoices([
                        ["Playing", "PLAYING"],
                        ["Streaming", "STREAMING"],
                        ["Listening", "LISTENING"],
                        ["Watching", "WATCHING"]
                    ])
            )
            .addStringOption(new SlashCommandStringOption()
                     .setName("activity")
                    .setDescription("The activity the bot will be doing")
                    .setRequired(true)
            )
            .addStringOption(new SlashCommandStringOption()
                     .setName("url")
                    .setDescription("The URL of the activity")
                    .setRequired(false)
            )

};






