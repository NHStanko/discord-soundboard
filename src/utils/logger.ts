import pino from "pino";
import { config } from "./config";
import * as fs from "fs";
import PinoPretty from "pino-pretty";

const streams = [
  { stream: PinoPretty({ colorize: true }), level: config.LOGGING_LEVEL },
  {
    stream: fs.createWriteStream(`${config.LOG_DIR}/discord-bot.log`),
    level: config.LOGGING_LEVEL,
  },
];
export const logger = pino(
  {
    level: config.LOGGING_LEVEL,
    name: "discord-bot",
  },
  pino.multistream(streams)
);
