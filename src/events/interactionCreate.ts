import log from "../log";
import client from "../main";
import { Event } from "./interfaces";

export const event: Event = {
  name: "interactionCreate",
  once: false,
  execute: async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      log.warn(`Command not found: ${interaction.commandName}`);
      log.debug({
        Interaction: interaction.toJSON(),
        Command: interaction.command.toJSON(),
      });
    }

    log.info(
      `${interaction.user.tag} executed ${interaction.commandName} in ${interaction.channelId}`
    );

    await command
      .execute(interaction)
      .then(() => {
        log.debug(`Command ${interaction.commandName} executed successfully`);
      })
      .catch((e) => {
        log.error(
          { Error: e, Interaction: interaction.toJSON() },
          "Encountered an error while execution a command"
        );
        interaction.reply({
          content: "There was an error executing your command!",
          ephemeral: true,
        });
      });
  },
};
