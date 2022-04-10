import dotenv from "dotenv";
import { ConfigInterface } from "./interfaces";
import configJson from "../../config/config.json";

function setUpConfig(configJson): ConfigInterface {
  const tokenEnv = dotenv.config({ path: "../../token.env" });

  // Grab the static config.json
  // TODO can create unique development/production configs and choose one with an input
  const config: ConfigInterface = {
    ...configJson,
  };

  // Copy the token from config/Token.env
  for (const key in config.ENV) {
    if (Object.getOwnPropertyDescriptor(tokenEnv, key)) {
      config.ENV[key] = tokenEnv[key];
    }
  }

  // Copy the normal env overrides from .env
  for (const key in config.ENV) {
    if (Object.getOwnPropertyDescriptor(process.env, key)) {
      config.ENV[key] = process.env[key];
    }
  }

  return config;
}

export const config = setUpConfig(configJson);
