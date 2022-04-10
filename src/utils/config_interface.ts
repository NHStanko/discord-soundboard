export interface ConfigInterface {
    TOKEN: string,
    NODE_ENV?: "development" | "production",
    GUILD_ID?: string,
    LOGGING_LEVEL?: "fatal" | "error" | "warn" | "info" | "debug" | "trace",
    LOG_DIR?: string,
}