import {type CommandContext,createUserOption,Declare,SubCommand,Options,Middlewares,} from "seyfert";
import { Watch, Yuna } from "yunaforseyfert";
import ms from "ms";


const options = {
    user: createUserOption({ description: "get a user", required: true })
};
@Declare({
    name: "unmute",
    description: "Desmutear a un usuario",
    defaultMemberPermissions: ["ModerateMembers"],
    botPermissions: ["ModerateMembers"],
    integrationTypes: ["GuildInstall"]
})
@Options(options)
@Middlewares(["CheckBots"])
export default class UnmuteCommand extends SubCommand {
    @Watch({
        idle: ms("1min"),
        beforeCreate(ctx) { const watcher = Yuna.watchers.find(ctx.client, { userId: ctx.author.id, command: this }); if (!watcher) return; watcher.stop("Just execute");},
    })
    override async run(ctx: CommandContext<typeof options>) {
        const user = ctx.options.user;
        const member = await (await ctx.guild())?.members.fetch(user.id);
        if (member?.mute) return ctx.write({ content: "el usuario ya esta aislado" });

        try { member?.timeout(null); } catch (e) { console.error(e); }

        ctx.write({ content: `el usuario ${user} fue desmuteado` });
    }
}