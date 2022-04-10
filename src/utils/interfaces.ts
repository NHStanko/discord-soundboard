import pino from "pino";

export interface ConfigInterface {
  LOGGING_LEVEL: pino.Level;
  LOG_DIR: string;
  ENV: {
    TOKEN: string;
    GUILD_ID: string;
    NODE_ENV: string;
  };
}
