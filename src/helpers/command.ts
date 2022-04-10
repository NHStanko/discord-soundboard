import { SlashCommandBuilder } from "@discordjs/builders";

export interface Command {
  // Execute happens on the command
  name: string;
  execute: (any) => Promise<void>;
  // Slash command builder contains the command name and description,
  // setup like 'new SlashCommandBuilder().setName("ping").setDescription("pong")'
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
}
