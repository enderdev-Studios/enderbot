import { type CommandContext, Declare, Command, Options, createStringOption, Middlewares, Container, Section, TextDisplay, Thumbnail, Separator } from "seyfert";
import { MessageFlags, Spacing } from "seyfert/lib/types/index.js";
 import { getCmds, getEmoji } from "#enderbot/utils/functions/functions.js";
import { Categories } from "#enderbot/types";

// Define options for the command

const options = { category: createStringOption({ description: "get a a category", }) };

@Declare({
    name: "help",
    description: "Mostrar comandos que tiene",
    integrationTypes: ["GuildInstall"],
    props: {
    category: Categories.info,
    usage: "help -category <categoryName>"
    }
})
@Options(options)
@Middlewares(["CheckBots"])
export default class HelpCommand extends Command { 
    override async run(ctx: CommandContext<typeof options>) {
        const categoria = ctx.options.category;
        const coconut = await getEmoji(ctx.client, "coconut");
        const categorias = ["- Config", "- Dev", "- Info", "- Mod", "- Fun", "- Utils"];


        const container = new Container().addComponents(
            new Section().addComponents(
                new TextDisplay().setContent(`# Comando help ${coconut}`),
                new TextDisplay().setContent(
                    `
                    \`\`\`
    _______             Hola a todos!
   /      /,            
  /      //             Estas son las categorias
 /______//              
(______(/               de mis comandos
                    \`\`\`
                    `
                ),
            ).setAccessory(new Thumbnail().setMedia(ctx.client.me.avatarURL({size: 256}))),
            new TextDisplay().setContent(`
                \`\`\`
                ${categorias.join("\n")}
                \`\`\`
                `
            ),
        );
        if (!categoria) return ctx.write({ components: [container], flags: MessageFlags.IsComponentsV2});
        const cmds = await getCmds(categoria, ctx.client);
        const containerCmds = new Container().addComponents(
            new Section().addComponents(
                new TextDisplay().setContent(`# Comando help ${coconut}`),
                new TextDisplay().setContent(`\`\`\`
 /\\_/\\    Hola muy buenas
( o.o )   estos son los comandos
 > ^ <    de ${categoria}
\`\`\``),
            ).setAccessory(new Thumbnail().setMedia(ctx.client.me.avatarURL({size: 256}))),
            new Separator().setSpacing(Spacing.Large),
            new TextDisplay().setContent(`\`\`\`
${cmds.join("\n")}
\`\`\``)
        );
		ctx.write({ components: [containerCmds], flags: MessageFlags.IsComponentsV2 });
    }
}