import { log } from "../utils/logger";
import { Event } from "./interfaces";

export const interactionCreate: Event = {
  name: "interactionCreate",
  once: false,
  async execute(_commands, commandCollection, interaction) {
    if (!interaction.isCommand()) {
      log.trace(`Non-command interaction detected: ${interaction.message}`);
      return;
    }

    const command = commandCollection.get(interaction.commandName);
    if (!command) {
      log.warn(
        `Command not found: ${interaction.commandName} - ${interaction.message}`
      );
      return;
    }

    try {
      await command.execute(interaction);
      log.info(
        `Command executed: ${interaction.commandName} - ${interaction.message}`
      );
    } catch (e) {
      log.error(
        e,
        `Error encountered at command execution:${interaction.commandName} - ${interaction.message}`
      );

      await interaction.reply({
        content: "Something went wrong!",
        emphemeral: true,
      });
    }
  },
};
