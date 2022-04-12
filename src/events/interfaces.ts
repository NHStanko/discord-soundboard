import { Interaction } from "discord.js";

export interface Event {
  name: string;
  once: boolean;
  execute: (interaction: Interaction, ...args) => void;
}
