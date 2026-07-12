import { SubCommand, type CommandContext,  createStringOption, createUserOption, Declare, Middlewares, Options } from "seyfert";
import { Watch, Yuna } from "yunaforseyfert";
import ms from "ms";

const options = {
  user: createUserOption({ description: "get a user", required: true }),
  time: createStringOption({ description: "Especifica el tiempo o perma?", required: true }),
  reason: createStringOption({ description: "Especifica una razon" }),
};
@Declare({
  name: "ban",
  description: "ban user",
  defaultMemberPermissions: ["BanMembers"],
  integrationTypes: ["GuildInstall"]
})
@Options(options)
@Middlewares(["CheckBots"])
export default class BanCommand extends SubCommand {

    @Watch({
      idle: ms("1min"),
      beforeCreate(ctx) { const watcher = Yuna.watchers.find(ctx.client, { userId: ctx.author.id, command: this }); if (!watcher) return; watcher.stop("Just execute"); },
    })

  override async run(ctx: CommandContext<typeof options>) {
    const user = ctx.options.user;
    const tiempo = ctx.options.time || "perma";
    const reason = ctx.options.reason || "undefined <:globo:1222262926694416485>";
    
    const regex = /\d+[smhdwMy]/;
     if (!regex.test(tiempo)) {
      return console.log("No funco");
    }
    const time = ms(tiempo);

    if (user.id === ctx.author.id) return ctx.write({ content: "no te puedes auto aislar" });
    const member = await (await ctx.guild())?.members.fetch(user.id);

    try {
      member?.ban({ delete_message_seconds: 3000 }, reason);
      if (time !== "perma") {
        setTimeout(async () => {
          (await (await ctx.guild())?.members)?.unban(user.id);
        }, time);
      }
    } catch (e) {
      console.error(e);
    }

    ctx.write({ embeds: [{ title: "User Banned", description: `user ${user} for the reason ${reason} \n Time Ban: ${tiempo}`, color: ctx.client.config.colors.enderbotColor }  ]});
  }
}