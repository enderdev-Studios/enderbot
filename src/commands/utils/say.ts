import { SubCommand, CommandContext, createStringOption, Declare, Middlewares, Options } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { Shortcut, Watch, Yuna } from "yunaforseyfert";
import ms from "ms";

// Define options for the command
const options = { text: createStringOption({ description: "El texto que enderbot va a decir", required: true }), };

@Declare({
    name: "say",
    description: "has que enderbot diga algo",
    integrationTypes: ["GuildInstall"],
})
@Options(options)
@Middlewares(["CheckBots"])
@Shortcut()
export default class SayCommand extends SubCommand {
    @Watch({
        idle: ms("1min"),
        beforeCreate(ctx) { const watcher = Yuna.watchers.find(ctx.client, { userId: ctx.author.id, command: this }); if (!watcher) return; watcher.stop("Just execute"); },
    })
    override async run(ctx: CommandContext<typeof options>) {
        const texto = ctx.options.text;

		if (texto.includes("@everyone") || texto.includes("@here"))  return ctx.write({ content: "everyone"});
		
        if (ctx.interaction === undefined) { await ctx.message?.delete("say xd"); return ctx.write({ content: texto }); }
        
		await ctx.client.messages.write(ctx.channelId, { content: texto });
        ctx.write({ content: "Se envio el texto", flags: MessageFlags.Ephemeral });
    }
}