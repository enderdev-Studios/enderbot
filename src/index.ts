import { Embed, Logger, } from "seyfert";
import { enderbot } from "#enderbot/client";
import { customLog } from "#enderbot/classes/Logger.js";
import { webhookId, webhookToken } from "#enderbot/utils/constants/Constants.js";
import { ChannelType } from "seyfert/lib/types/index.js";
process.loadEnvFile(".env");
import "#enderbot/utils/utils/anticrash.js";

Logger.customize(customLog);
Logger.saveOnFile = "all";
Logger.dirname = "logs";

export const client = new enderbot();

client.cache.channels!.filter = (channel) => {
    return ![ChannelType.DM, ChannelType.GroupDM ].includes(channel.type);
};

await client.run();

const embed = new Embed().setTitle("enderbot is started!").setDescription("enderbot is now running smoothly.").setColor(client.config.colors.enderbotColor).setTimestamp(new Date()).setFooter({ text: "enderbot" }).setThumbnail("https://enderdev.vercel.app/enderdev.jpg");

client.webhooks.writeMessage(webhookId, String(webhookToken), {
    body: { embeds: [embed] },
    query: { wait: true }
}).then(async (msg) => {
    setTimeout(() => msg?.delete(), 5e3);
});

