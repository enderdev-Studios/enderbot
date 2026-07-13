import { Declare, Command, type CommandContext, Middlewares, Container, Separator, TextDisplay, Thumbnail, Section, Button } from "seyfert";
import { ButtonStyle, MessageFlags, Spacing } from "seyfert/lib/types/index.js";
import { GithubRepo } from "#enderbot/utils/constants/Constants.js";

@Declare({
    name: "info",
    description: "Informacion sobre mi",
    integrationTypes: ["GuildInstall"]
})
@Middlewares(["CheckBots"])
export default class InfoCommand extends Command {
    override async run(ctx: CommandContext) {
        const components = new Container().setColor(ctx.client.config.colors.enderbotColor).addComponents(
            new Section()
                .setComponents(
                    new TextDisplay().setContent([
                        `# Informacion de ***${ctx.client.me.username}***`,
                        `***Hola soy ${ctx.client.me.username}, soy un bot divertido y personal.***`,
                        "Claro tengo algunas funciones de proteccion y todo eso pero me concentro en pasarmela bien xd",
                        `- Prefix: **"${ctx.client.config.prefix.join(", ")}r"**`,
                        `- Creado el: **"${ctx.client.me.createdAt.toLocaleDateString()}"**`,
                    ].join("\n")),
                )
                .setAccessory(new Thumbnail().setMedia(ctx.client.me.avatarURL({ forceStatic: true, size: 64 }) as string)),
            new Separator().setSpacing(Spacing.Large), // Informacion Basica del Bot
            new Section()
                .setComponents(new TextDisplay().setContent("Creado por [enderdev](https://youtube.com/@enderdev-v)"))
                .setAccessory(new Button().setStyle(ButtonStyle.Link).setLabel("enderdev-v github").setURL("https://github.com/enderdev-v/")),
            new Section()
                .setComponents(new TextDisplay().setContent("Soy Opensource es decir puedes contribuir en mi desarrollo :D"))
                .setAccessory(new Button().setStyle(ButtonStyle.Link).setLabel("enderbot Repo").setURL(GithubRepo)),
            new Separator().setSpacing(Spacing.Small),
            new TextDisplay().setContent("-# Cualquier ayuda o cosa puedes entrar al server [enderdevStudios](https://discord.com/invite/pchahTHgwP)")
        );
        ctx.write({ components: [components], flags: MessageFlags.IsComponentsV2 });
    }
}