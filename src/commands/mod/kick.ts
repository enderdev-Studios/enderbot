import { type CommandContext,  createStringOption, createUserOption, Declare, Options, SubCommand, Middlewares } from "seyfert";
import { Categories } from "#enderbot/types";

const options = {
  user: createUserOption({
    description: "get a user",
    required: true
  }),
  reason: createStringOption({
    description: "Especifica una razon"
  }),
};

@Declare({
  name: "kick",
  description: "Saca a un usuario", 
  integrationTypes: ["GuildInstall"],
  defaultMemberPermissions: ["KickMembers"],
    botPermissions: ["KickMembers"],
    props: {
      category: Categories.mod,
      usage: "kick -user <user> -reason <reason>"
    }
})

@Options(options)
@Middlewares(["CheckBots"])
export default class KickCommand extends SubCommand {
  override async run(ctx: CommandContext<typeof options>) {
    const user = ctx.options.user;
    const reason = ctx.options.reason || "undefined <:globo:1222262926694416485>";

    if (user.id === ctx.author.id) return ctx.write({ content: "no te puedes auto aislar" });
    const member = await (await ctx.guild())?.members.fetch(user.id);

    try {
      member?.kick(reason);
    } catch (e) {
      console.error(e);
    }

    ctx.write({ embeds: [{ title: "Usuario Kicked", description: `user ${user} for the reason ${reason}`, color: ctx.client.config.colors.enderbotColor }  ]});
  }
}