import { Declare, Command, type CommandContext, Middlewares } from "seyfert";
import { getEmoji } from "#enderbot/utils/functions/functions.js";
import { Categories } from "#enderbot/types";

@Declare({
  name: "ping",
  description: "mucho ping",
  integrationTypes: ["GuildInstall", "UserInstall"],
  props: {
    category: Categories.info,
    usage: "ping"
    }
})
@Middlewares(["CheckBots"])
export default class PingCommand extends Command {
  override async run(ctx: CommandContext) {
    const shine = await getEmoji(ctx.client, "shine")
    await ctx.write({content: `${shine} Pong! ${ctx.client.gateway.latency}ms`});
  }
}