import config from "../config";
import fs from "fs";
import pino, { Logger } from "pino";
import PinoPretty from "pino-pretty";

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

const log: Logger = pino(
  {
    level: logLevel,
    name: "discord-bot",
  },
  pino.multistream(streams)
);

export default log;
