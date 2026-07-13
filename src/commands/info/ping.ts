import { Declare, Command, type CommandContext, Middlewares } from "seyfert";
import { getEmoji } from "#enderbot/utils/functions/functions.js";

@Declare({
  name: "ping",
  description: "mucho ping",
  integrationTypes: ["GuildInstall", "UserInstall"]
})
@Middlewares(["CheckBots"])
export default class PingCommand extends Command {
  override async run(ctx: CommandContext) {
    const shine = await getEmoji(ctx.client, "shine")
    await ctx.write({content: `${shine} Pong! ${ctx.client.gateway.latency}ms`});
  }
}