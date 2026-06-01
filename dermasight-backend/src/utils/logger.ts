import "dotenv/config";

import { createLogger, format, transports, config, LoggerOptions } from "winston";

const { combine, timestamp, printf } = format;
const { Console } = transports;

const logLevels = config.syslog.levels;
const logColors: Record<string, string> = {
    emerg: "1;41;33",
    alert: "1;41;37",
    crit: "1;31",
    error: "1;31",
    warning: "1;33",
    notice: "1;34",
    info: "1;36",
    debug: "1;37"
};

const colorizeFormat = (text: string, ansiCode: string): string => {
    return `\x1b[${ansiCode}m${text}\x1b[0m`;
};

const loggerOptions: LoggerOptions = {
    levels: logLevels,
    level: process.env.ENVIRONMENT === "development" ? "debug" : "info",
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        printf(({ level, message, timestamp }): string => {
            const isError =
                level === "error" || level === "crit" || level === "alert" || level === "emerg";

            return `[${colorizeFormat(timestamp as string, "1;34")}] ${colorizeFormat(level.toUpperCase(), logColors[level] ?? "1;37")}: ${colorizeFormat(message as string, isError ? "1;31" : "1;37")}`;
        })
    ),
    transports: [new Console()]
};

const logger = createLogger(loggerOptions);

export default logger;
