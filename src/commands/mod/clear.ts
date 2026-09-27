import { type CommandContext, Declare, SubCommand,Options, TextGuildChannel,createIntegerOption,Middlewares, Embed,} from "seyfert";
import { Shortcut, Watch, Yuna } from "yunaforseyfert";
import ms from "ms";
import { Categories } from "#enderbot/types";

const options = {
    count: createIntegerOption({
        description: "get a a category",
        required: true
    })
};
@Declare({
    name: "clear",
    description: "Borrar mensajes",
    defaultMemberPermissions: ["ModerateMembers"],
    botPermissions: ["ModerateMembers"],
    integrationTypes: ["GuildInstall"],
    props: {
    category: Categories.mod,
    usage: "clear -count <count>"
  }
})
@Options(options)
@Middlewares(["CheckBots"])
@Shortcut()
export default class ClearCommand extends SubCommand {
    @Watch({
        idle: ms("1min"),
        beforeCreate(ctx) { const watcher = Yuna.watchers.find(ctx.client, { userId: ctx.author.id, command: this });if (!watcher) return;watcher.stop("Just execute");},
    })
    override async run(ctx: CommandContext<typeof options>) {
        try {
            const cantidad = ctx.options.count; const id = ctx.channelId; const guild = await ctx.guild();
            const channel = await guild?.channels.fetch(id);
            if (!(channel instanceof TextGuildChannel)) return;
            const embederror = new Embed().setTitle("Cantidad Excedida").setDescription("No se pueden borrar más de 99 mensajes a la vez.").setColor(ctx.client.config.colors.enderbotColor);
            const embedmin = new Embed().setTitle("Cantidad insuficiente").setDescription("Tiene que ser mas de 2 mensajes").setColor(ctx.client.config.colors.enderbotColor);
            
            if (cantidad > 99) return ctx.write({ embeds: [embederror] });
            if (cantidad < 1) return ctx.write({ embeds: [embedmin] });
            const msglist = await channel.messages.list({
                before: ctx.message?.id || channel.lastMessageId as string,
                limit: cantidad
            });
            const msgIds = msglist.map(msg => {
                if (msg.createdTimestamp < Date.now() - 14 * 24 * 3600 * 1000) return; return msg.id; 
            }).filter(Boolean) as string[];
            
            channel.messages.purge(msgIds, "Bulk Deleted by Clear Command");
            const embed = new Embed().setTitle("Clear Command").setDescription(`Se han eliminado **${msgIds.length}** mensajes.`).setColor(ctx.client.config.colors.enderbotColor);
            ctx.write({ embeds: [embed] });
        } catch (error) {
            console.error("Error al eliminar los mensajes:", error);
        }

    }
}