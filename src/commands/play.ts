import { Command } from "./interfaces";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getSubscription } from "../sound/subscriptions";
//import { VoiceSubscription } from "../sound/voiceSubscription";

export const command: Command = {
  name: "play",
  execute: async (interaction) => {
    getSubscription(interaction)
  },
  data: new SlashCommandBuilder().setName("play").setDescription("play song"),
};