import { Declare, SubCommand, type CommandContext, Middlewares, Options, createChannelOption, createStringOption } from "seyfert";
import { Categories } from "#enderbot/types";
const options = {
    channel: createChannelOption({
        description: "Member Options",
        required: true,
    }),
    value: createStringOption({
        description: "Config Value",
        required: true,
        choices: [
            { name: "Delete", value: "delete" },
            { name: "Adding", value: "add" },
        ]
    })
};
@Declare({
    name: "crosspot",
    description: "Configura los canales de crosspost",
    integrationTypes: ["GuildInstall"],
    props: {
        category: Categories.config,
        usage: "crosspot -channel <channel> -value <value>"
    }
})
@Middlewares(["CheckBots"])
@Options(options)
export default class GuildCommand extends SubCommand {
    override async run(ctx: CommandContext<typeof options>) {
        if (!ctx.guildId) return;
        // Options
        const channel = ctx.options.channel;
        const value = ctx.options.value;

        const data = await ctx.client.db.prisma.messageCrossPost.findUnique({ where: { guildId: ctx.guildId! } });
        const ArrChannels = data?.channelIds || [];
        switch (value) {
            case "add": ArrChannels.push(channel.id); break;
            case "delete":  { const index = ArrChannels.indexOf(channel.id); if (index > -1) ArrChannels.splice(index, 1); } break;
            default: ctx.write({ content: "Opción no válida" }); break;
        }
        await ctx.client.db.prisma.messageCrossPost.upsert({ where: { guildId: ctx.guildId }, update: {channelIds: ArrChannels}, create: { guildId: ctx.guildId, channelIds: ArrChannels } });
        return ctx.write({ content: `Configuracion de <#${channel.id}> creada, ahora cada mensaje sera publicado automaticamente` });

    }
}