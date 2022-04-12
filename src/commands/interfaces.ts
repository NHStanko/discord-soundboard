import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface Command {
  name: string;
  execute: (interaction: CommandInteraction) => Promise<void>;
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
}
