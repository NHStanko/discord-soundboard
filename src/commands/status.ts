import log from "../log";
import client from "../main";
import { Command } from "./interfaces";
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { ExcludeEnum } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";

export const command: Command = {
  name: "status",
  execute: async (interaction) => {
    const name = interaction.options.getString("activity");
    const type = interaction.options.getString("type") as ExcludeEnum<
      typeof ActivityTypes,
      "CUSTOM"
    >;
    const url = interaction.options.getString("url");

    // Check if url is a youtube or twitch link
    if (url !== undefined && url !== null) {
      if (!(type === "STREAMING")) {
        interaction.reply({
          content: "Can only include a url if you are streaming!",
          ephemeral: true,
        });
        return;
        // TODO buff this up lmao we need regex probably
      } else if (!(url.includes("youtube.com") || url.includes("twitch.tv"))) {
        interaction.reply({
          content: "Invalid url! Please include a twitch or youtube link",
          ephemeral: true,
        });
        return;
      }
    }

    try {
      log.info({ Activity: name, Type: type, url: url }, "Setting status");
      client.user.setActivity({ name, type, url });
    } catch (e) {
      log.error(e, "Failed to set activity");
    }

    interaction.reply({
      content: "Set Status!",
      ephemeral: true,
    });
  },
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Change the status of the bot")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of the bot will be doing")
        .setRequired(true)
        .addChoices([
          ["Playing", "PLAYING"],
          ["Streaming", "STREAMING"],
          ["Listening", "LISTENING"],
          ["Watching", "WATCHING"],
        ])
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("activity")
        .setDescription("The activity the bot will be doing")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("url")
        .setDescription("The URL of the activity")
        .setRequired(false)
    ),
};
