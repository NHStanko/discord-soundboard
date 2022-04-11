import fs from "fs";
import pino from "pino";
import PinoPretty from "pino-pretty";
import { config } from "./config";

const logLevel: pino.Level =
  config.LOGGING_LEVEL === "trace"
    ? "trace"
    : config.LOGGING_LEVEL === "debug"
    ? "debug"
    : config.LOGGING_LEVEL === "warn"
    ? "warn"
    : config.LOGGING_LEVEL === "error"
    ? "error"
    : config.LOGGING_LEVEL === "fatal"
    ? "fatal"
    : "info";

const streams = [
  {
    stream: PinoPretty({ colorize: true }),
    level: logLevel,
  },
  {
    stream: fs.createWriteStream(`${config.LOG_DIR}/discord-bot.log`),
    level: logLevel,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  },
];

export const log = pino(
  {
    level: logLevel,
    name: "discord-bot",
  },
  pino.multistream(streams)
);
