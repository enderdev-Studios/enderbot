import { type CommandContext, createStringOption, createUserOption, Declare, SubCommand, Options, Middlewares, } from "seyfert";
 
import ms from "ms";
import { Categories } from "#enderbot/types";


const options = {
    user: createUserOption({ description: "get a user", required: true }),
    time: createStringOption({ description: "Especifica el tiempo", required: true }),
    reason: createStringOption({ description: "Especifica una razon" })
};
@Declare({
    name: "timeout",
    description: "timeout user",
    defaultMemberPermissions: ["ModerateMembers"],
    botPermissions: ["ModerateMembers"],
    props: {
        category: Categories.mod,
        usage: "timeout -user <user> -time <time> -reason <reason>"
    }
})
@Options(options)
@Middlewares(["CheckBots"])
export default class MuteCommand extends SubCommand { 
    override async run(ctx: CommandContext<typeof options>) {
        const user = ctx.options.user;
        let tiempo = ctx.options.time || "2m";
        const muteReason = ctx.options.reason || "undefined <:globo:1222262926694416485>";
        const member = await (await ctx.guild())?.members.fetch(user.id);
        const regex = /\d+[smhdw]/;
        const time = ms(tiempo);
        if (!regex.test(tiempo)) return console.log("No funco");
        const rxp = /\d+[smh]/;
        const rxpz = /\d+[dw]/;
        if (rxp.test(tiempo)) tiempo = "PT" + tiempo.toUpperCase();
        else if (rxpz.test(tiempo)) tiempo = "PT" + tiempo.toUpperCase();
        else return await ctx.write({ content: "Esa duracion no es valida <:globo:1222262926694416485>" });
        if (user.id === ctx.author.id) return ctx.write({ content: "no te puedes auto aislar" });

        if (member?.mute) return ctx.write({ content: "el usuario ya esta aislado" });

        try { member?.timeout(Number(tiempo), muteReason); } catch (e) { console.error(e); }

        ctx.write({ content: `el usuario ${user} fue muteado por ${time} con la razon de ${muteReason}` });

    }
}