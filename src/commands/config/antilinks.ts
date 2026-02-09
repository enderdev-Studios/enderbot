import { Declare, SubCommand, type CommandContext, Middlewares, Options, createMentionableOption, createStringOption } from "seyfert";
const options = {
    exception: createMentionableOption({
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
    name: "antilinks",
    description: "Configura las excepciones de antilinks",
    integrationTypes: ["GuildInstall"]
})
@Middlewares(["CheckBots"])
@Options(options)
export default class GuildCommand extends SubCommand {
    override async run(ctx: CommandContext<typeof options>) {
        const guild = await ctx.guild(); if (!guild || !ctx.guildId) return;
        // Options
        const exception = ctx.options.exception;
        const value = ctx.options.value;
        const member = await guild?.members.fetch(exception.id).catch(() => null);

        const data = await ctx.client.db.prisma.antilink.findUnique({ where: { guildId: ctx.guildId! } });
        const ArrMembers = data?.MembersExceptions || [];
        const ArrRoles = data?.RolesExceptions || [];
        switch (value) {
            case "add": if (member) { ArrMembers.push(exception.id); } else { ArrRoles.push(exception.id); } break;
            case "delete": if (member) {
                const index = ArrMembers.indexOf(exception.id); if (index > -1) ArrMembers.splice(index, 1);
            } else { 
                const index = ArrRoles.indexOf(exception.id); if (index > -1) ArrRoles.splice(index, 1);
            } break;
            default: ctx.write({ content: "Opción no válida" }); break;
        }

        await ctx.client.db.prisma.antilink.upsert({ where: { guildId: ctx.guildId }, update: { RolesExceptions: ArrRoles, MembersExceptions: ArrMembers }, create: { guildId: ctx.guildId, MembersExceptions: ArrMembers , RolesExceptions: ArrRoles, } });
        return ctx.write({ content: `Excepciones de Antilinks \n se ha ${value === "add" ? "añadido" : "eliminado"} a ${member ? `<@${exception.id}>` : `<@&${exception.id}>`}` });

    }
}