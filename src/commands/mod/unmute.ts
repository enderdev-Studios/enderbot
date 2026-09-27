import {type CommandContext,createUserOption,Declare,SubCommand,Options,Middlewares,} from "seyfert";
import { Categories } from "#enderbot/types";

const options = {
    user: createUserOption({ description: "get a user", required: true })
};
@Declare({
    name: "unmute",
    description: "Desmutear a un usuario",
    defaultMemberPermissions: ["ModerateMembers"],
    botPermissions: ["ModerateMembers"],
    integrationTypes: ["GuildInstall"],
    props: {
        category: Categories.mod,
        usage: "unmute -user <user>"
    }
})
@Options(options)
@Middlewares(["CheckBots"])
export default class UnmuteCommand extends SubCommand {
    override async run(ctx: CommandContext<typeof options>) {
        const user = ctx.options.user;
        const member = await (await ctx.guild())?.members.fetch(user.id);
        if (member?.mute) return ctx.write({ content: "el usuario ya esta aislado" });

        try { member?.timeout(null); } catch (e) { console.error(e); }

        ctx.write({ content: `el usuario ${user} fue desmuteado` });
    }
}