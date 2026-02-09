import { Declare, SubCommand, type CommandContext, Middlewares, Options, createRoleOption, createChannelOption } from "seyfert";
const options = {
    tag: createRoleOption({
        description: "Member Options",
        required: true,
    }),
    channel: createChannelOption({
        description: "Canal a configurar",
        required: true,
    })
};
@Declare({
    name: "autotag",
    description: "Configura los canales de autotag",
    integrationTypes: ["GuildInstall"]
})
@Middlewares(["CheckBots"])
@Options(options)
export default class GuildCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        if (!ctx.guildId) return;
        // Options
        const channel = ctx.options.channel;
        const tag = ctx.options.tag;

        
        await ctx.client.db.prisma.autoTag.upsert({ where: { guildId: ctx.guildId }, update: { channelId: channel.id, roleId: tag.id}, create: { guildId: ctx.guildId, channelId: channel.id, roleId: tag.id } });
        return ctx.write({ content: `Configuracion de <#${channel.id}> creada, ahora cada mensaje tendra un tag acompañado de <@&${tag.id}>` });

    }
}