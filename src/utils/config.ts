import "dotenv/config";
import dotenv from "dotenv";
import { ConfigInterface } from "./interfaces";
import configJson from "../../config/config.json";
import path from "path";

function setUpConfig(): ConfigInterface {
  // Create an empty ConfigInterface from config.json
  // TODO can create unique development/production configs and choose one with an input
  const config: ConfigInterface = {
    ...configJson,
    TOKEN: "FILL_IN_TOKEN_ENV",
    GUILD_ID: "FILL_IN_TOKEN_ENV",
    NODE_ENV: "development",
  };

  // Copy dotenv overrides
  for (const key in config) {
    if (Object.getOwnPropertyDescriptor(process.env, key)) {
      config[key] = process.env[key];
    }
  }

  return config;
}

// Load the vars in config/token.env
dotenv.config({ path: path.resolve("config/token.env") });
export const config = setUpConfig();
