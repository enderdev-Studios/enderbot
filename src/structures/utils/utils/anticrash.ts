import { inspect } from "node:util";
import { Embed } from "seyfert";
import { memoryUsage } from "#enderbot/utils/functions/functions.js";
import { webhookId, webhookToken } from "#enderbot/utils/constants/Constants.js";
import { LoggerColor } from "#enderbot/types";
import { client } from "../../../index.js";
import chalk from "chalk";
// unhandledRejection


process.on("unhandledRejection", (e) => {
    const embed = new Embed()
        .setTitle("enderbot Rejection")
        .setColor(client.config.colors.errorColor)
        .addFields({ name: "Reason", value: `\`\`\`${inspect(e, { depth: 0 }).slice(0, 1000)}\`\`\`` })
        .setTimestamp();

    console.error(chalk.bold.red("[ AntiCrash System ]:"), e);
    return client.webhooks.writeMessage(webhookId, webhookToken, { body: { embeds: [embed] }, });
});

// uncaught exceptions

process.on("uncaughtException", (e, origin) => {

    const embed = new Embed()
        .setTitle("enderbot error Exception/Catch")
        .setColor(client.config.colors.errorColor)
        .addFields([
            { name: "Error", value: `\`\`\`${inspect(e, { depth: 0 }).slice(0, 1000)}\`\`\`` },
            { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
        ])
        .setTimestamp();

    console.error(chalk.bold.yellow("[ AntiCrash System ]:"));
    console.log(e, origin);
    return client.webhooks.writeMessage(webhookId, webhookToken, {
        body: { embeds: [embed] },
    });
});

// uncaught exceptions monitor

process.on("uncaughtExceptionMonitor", (e, origin) => {

    const embed = new Embed()
        .setTitle("error Exception Monitor")
        .setColor(client.config.colors.errorColor)
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
        .addFields(
            { name: "Error", value: `\`\`\`${inspect(e, { depth: 0 }).slice(0, 1000)}\`\`\`` },
            { name: "Origin", value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\`` }
        )
        .setTimestamp();
    
    console.error(chalk.bold.red("[ AntiCrash System ]:"));
    console.error(e, origin);
    return client.webhooks.writeMessage(webhookId, webhookToken, {
        body: { embeds: [embed] },
    });
});

process.on("warning", (warn) => {
    const embed = new Embed()
        .setTitle("enderbot Exception Monitor Warn")
        .setColor(client.config.colors.errorColor)
        .setURL("https://nodejs.org/api/process.html#event-warning")
        .addFields({ name: "Warning", value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\`` })
        .setTimestamp();

    console.error(chalk.bold.yellow("[ AntiCrash WarnSystem ]:"));
    console.error(warn);
    return client.webhooks.writeMessage(webhookId, webhookToken, {
        body: { embeds: [embed] },
    });
});

process.on("multipleResolved", () => { });
console.log(memoryUsage(), chalk.bold.hex(LoggerColor.checkLogger)("[ CHECK ]") + " " + "Anticrash cargado");