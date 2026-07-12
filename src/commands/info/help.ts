import { type CommandContext, Declare, Command, Options, createStringOption, Middlewares, Container, Section, TextDisplay, Thumbnail, Separator } from "seyfert";
import { MessageFlags, Spacing } from "seyfert/lib/types/index.js";
import { Watch, Yuna } from "yunaforseyfert";
import { getCmds, getEmoji } from "#enderbot/utils/functions/functions.js";
import ms from "ms";

// Define options for the command

const options = { category: createStringOption({ description: "get a a category", }) };

@Declare({
    name: "help",
    description: "Mostrar comandos que tiene",
    integrationTypes: ["GuildInstall"]
})
@Options(options)
@Middlewares(["CheckBots"])
export default class HelpCommand extends Command {
    @Watch({
        idle: ms("1min"),
        beforeCreate(ctx) { const watcher = Yuna.watchers.find(ctx.client, { userId: ctx.author.id, command: this }); if (!watcher) return; watcher.stop("Just execute"); },
    })
    override async run(ctx: CommandContext<typeof options>) {
        const categoria = ctx.options.category;
        const java = await getEmoji(ctx.client, "java");
        const coconut = await getEmoji(ctx.client, "coconut");
        const categorias = ["- ***Config***", "- ***Dev***", "- ***Info***", "- ***Mod***", "- ***Fun***", "- ***Utils***"];


        const container = new Container().addComponents(
            new Section().addComponents(
                new TextDisplay().setContent(`# Comando help ${java}`),
                new TextDisplay().setContent(`${coconut} | Hola muy buenas estas son las categorias de mis comandos:`),
            ).setAccessory(new Thumbnail().setMedia(ctx.client.me.avatarURL({size: 256}))),
            new Separator().setSpacing(Spacing.Large),
            new TextDisplay().setContent(categorias.join("\n"))
        );
        if (!categoria) return ctx.write({ components: [container], flags: MessageFlags.IsComponentsV2});
        const cmds = await getCmds(categoria, ctx.client);
        const containerCmds = new Container().addComponents(
            new Section().addComponents(
                new TextDisplay().setContent(`# Comando help ${java}`),
                new TextDisplay().setContent(`${coconut} | Hola muy buenas estas son los comandos de ***${categoria}***:`),
            ).setAccessory(new Thumbnail().setMedia(ctx.client.me.avatarURL({size: 256}))),
            new Separator().setSpacing(Spacing.Large),
            new TextDisplay().setContent(cmds.join("\n"))
        );
		ctx.write({ components: [containerCmds], flags: MessageFlags.IsComponentsV2 });
    }
}