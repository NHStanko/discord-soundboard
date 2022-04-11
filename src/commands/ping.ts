import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "./interfaces";

// Create an instance of the command using the Command Interface
export const ping: Command = {
  // Execute happens on the command
  name: "ping",
  execute: async (interaction) => {
    interaction.reply({
      content: "Pong!",
      ephemeral: true,
    });
  },
  // Slash command builder contains the command name and description
  data: new SlashCommandBuilder().setName("ping").setDescription("pong"),
};
