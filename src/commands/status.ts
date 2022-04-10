import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { Command } from "../helpers/command"
import { client } from "../main";
import { logger } from "../utils/logger";

// Create an instance of the command using the Command Interface
export const status: Command = {
    // Execute happens on the command
    name: "status",
    execute: async (interaction) => {
        logger.debug(interaction);
        client.user.setPresence({
            activities: [
                {name: interaction.options.getString("activity")},
                {type: interaction.options.getString("type")},
                {url: interaction.options.getString("url")}
            ],
        });


        interaction.reply({
            content: "Pong!",
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






