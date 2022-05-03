import { Command } from "./interfaces";
import { SlashCommandBuilder } from "@discordjs/builders";

export const command: Command = {
  name: "ping",
  execute: async (interaction) => {
    interaction.reply({
      content: "Pong!",
      ephemeral: true,
    });
  },
  data: new SlashCommandBuilder().setName("ping").setDescription("pong"),
};