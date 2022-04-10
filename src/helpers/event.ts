import { Collection } from "discord.js";
import { Command } from "./command";
export interface Event {
  // Name of the event, list of events can be seen here
  // https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-apiRequest
  name: string;

  once: boolean;
  execute: (
    commandList: JSON[],
    commandCollection: Collection<string, Command>,
    ...args
  ) => void;
}
