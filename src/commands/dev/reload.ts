import { Command, CommandContext, createStringOption, Declare, Message, Middlewares, Options } from "seyfert";
import { Watch, Yuna } from "yunaforseyfert";
import { Categories } from "#enderbot/types";
import ms from "ms";

export const options = {
    option: createStringOption({
        description: "Escoger una opcion de recarga",
        required: true,
        choices: [{ name: "commands", value: "commands" }, { name: "events", value: "events" }, { name: "reset", value: "reset" }]
    }),
};

@Declare({
    name: "reload",
    description: "recarga algun que otro comando xd",
    integrationTypes: ["GuildInstall"],
    props: {
    category: Categories.dev,
    usage: "reload <option>"
  }
})
@Options(options)
@Middlewares(["Onlydev", "CheckBots"])
export default class SayCommand extends Command {
    @Watch({
        idle: ms("1min"),
        beforeCreate(ctx) {
            const watcher = Yuna.watchers.find(ctx.client, { userId: ctx.author.id, command: this });
            if (!watcher) return;

            watcher.stop("Just execute");
        },

    })
    override async run(ctx: CommandContext<typeof options>) {
        const option = ctx.options.option;
        switch (option.toLocaleLowerCase()) {
            case "commands": 
                ctx.client.commands?.reloadAll();
                ctx.client.uploadCommands();
                break;
            case "events":
                ctx.client.events?.reloadAll();
                break;
            case "reset":
                ctx.client.reload();
                break;
            default:
                return ctx.write({ content: "debes escoger una opcion : commands, events" });
        }
        ctx.write({ embeds: [{ title: `Recargando ${option}`, description: "<:dino_ryo:1325620344459104372> Recargando", color: ctx.client.config.colors.enderbotColor }] }).then(async m => {
            (m as Message).edit({ embeds: [{ title: "Reload command", description: `<:dino_ryo:1325620344459104372> ${option}, Cargados`, color: ctx.client.config.colors.enderbotColor }] });
        });
    }
}