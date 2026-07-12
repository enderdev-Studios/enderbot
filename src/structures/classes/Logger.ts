import { memoryUsage } from "#enderbot/utils/functions/functions.js";
import { LoggerColor, LoggerLevel } from "#enderbot/types";
import { Logger } from "seyfert";
import { LogLevels } from "seyfert/lib/common/index.js";

import chalk from "chalk";

export function customLog(_this: Logger, level: LogLevels | LoggerLevel, args: unknown[]): unknown[] {
    const memoryData = memoryUsage();
    const name = [
        ["[ DEBUG ]", LoggerColor.debugLogger],
        ["[ INFO ]", LoggerColor.infoLogger],
        ["[ WARN ]", LoggerColor.warnLogger],
        ["[ ERROR ]", LoggerColor.errorLogger],
        ["[ FATAL ]", LoggerColor.FatalLogger],
        ["[ CHECK ]", LoggerColor.checkLogger],
    ];
    const color = name[level][1] as string;
    const text = `${chalk.italic(`${memoryData}`)} ${chalk.bold.hex(color)(`${name[level][0]}`)}`;

    return [text, ...args];

}