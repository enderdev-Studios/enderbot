import { SubCommand, CommandContext, createStringOption, Declare, Middlewares, Options } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { Shortcut } from "yunaforseyfert";
import { Categories } from "#enderbot/types";

// Define options for the command
const options = { text: createStringOption({ description: "El texto que enderbot va a decir", required: true }), };

@Declare({
    name: "say",
    description: "has que enderbot diga algo",
    integrationTypes: ["GuildInstall"],
    props: {
        category: Categories.util,
        usage: "say -text <text>"
    },
})
@Options(options)
@Middlewares(["CheckBots"])
@Shortcut()
export default class SayCommand extends SubCommand { 
    override async run(ctx: CommandContext<typeof options>) {
        const texto = ctx.options.text;

		if (texto.includes("@everyone") || texto.includes("@here"))  return ctx.write({ content: "everyone"});
		
        if (ctx.interaction === undefined) { await ctx.message?.delete("say xd"); return ctx.write({ content: texto }); }
        
		await ctx.client.messages.write(ctx.channelId, { content: texto });
        ctx.write({ content: "Se envio el texto", flags: MessageFlags.Ephemeral });
    }
}