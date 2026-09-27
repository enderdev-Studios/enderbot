import { Declare, type CommandContext, Middlewares, createStringOption, Options, Container, Separator, TextDisplay, Section, SubCommand, Thumbnail } from "seyfert";
import { Spacing, MessageFlags, } from "seyfert/lib/types/index.js";
import { Shortcut } from "yunaforseyfert";
import { HexColor } from "#enderbot/utils/functions/functions.js";
import { Categories } from "#enderbot/types";

const options = {
    title: createStringOption({ description: "Escribe el titulo de tu articulo", required: true }),
    text: createStringOption({ description: "Escribe el texto de tu articulo", required: true }),
    footer: createStringOption({ description: "Escribe el footer de tu articulo", required: true }),
    color: createStringOption({ description: "Escribe el footer de tu articulo", required: true })
};
@Declare({
    name: "article",
    aliases: [],
    description: "Crea un articulo",
    props: {
        category: Categories.util,
        usage: "article -title <title> -text <text> -footer <footer> -color <color>"
    },
})
@Middlewares(["CheckBots"])
@Options(options)
@Shortcut()
export default class ArticleCommand extends SubCommand {
    override async run(ctx: CommandContext<typeof options>) {
        const title = ctx.options.title;
        const text = ctx.options.text;
        const footer = ctx.options.footer;
        const color = ctx.options.color;
       
        // Normaliza el color para .setColor de seyfert usando ternarias
        const scolor = color.includes("#") ? color.replace("#", "") : color.includes("0x") ? color.replace("0x", "") : color;
        const hex = !HexColor(scolor) ? ctx.client.config.colors.enderbotColor : Number("0x" + scolor.toLocaleLowerCase());

        const components = new Container().setColor(hex).addComponents(
            new Section().addComponents(
                new TextDisplay().setContent(`# ${title}`),
                new TextDisplay().setContent(`***Hecho por: ${ctx.author!.globalName}***`),
            ).setAccessory(new Thumbnail().setMedia(ctx.author!.avatarURL({ extension: "png", size: 256 }))),
            new Separator().setSpacing(Spacing.Small), // Primer Separador
            new TextDisplay().setContent(text),
            new Separator().setSpacing(Spacing.Large).setDivider(true), // Primer Separador
            new TextDisplay().setContent(`-# ${footer}`)
        );



        await ctx.write({ components: [components], flags: MessageFlags.IsComponentsV2 });
    }
}