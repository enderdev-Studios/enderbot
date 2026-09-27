import { Declare, Command, type CommandContext, createStringOption, Options, Middlewares, createBooleanOption } from "seyfert";
import { ActivityType } from "seyfert/lib/types/index.js";
import { setActivity, snap } from "#enderbot/utils/functions/functions.js";
import { Categories } from "#enderbot/types";

const options = {
  random: createBooleanOption({
    description: "Quieres que sea random o no?", required: true
  }),
  type: createStringOption({
    description: "tipo de presencia", required: false
  }),
  name: createStringOption({
    description: "Nombre de la activity", required: false
  }),
  state: createStringOption({
    description: "estado del bot", required: false
  })
};

@Declare({
  name: "customact",
  description: "Customizar la actividad del bot",
  aliases: ["ca", "custacty"],
  props: {
    category: Categories.dev,
    usage: "customact -random <random> -type <type> -name <name> -state <state>"
  }
})
@Options(options)
@Middlewares(["Onlydev", "CheckBots"])
export default class ActivityCommand extends Command {
  override async run(ctx: CommandContext<typeof options>) {
    try {
      const random = ctx.options.random;
      const type = ctx.options.type;
      const name = ctx.options.name;
      const state = ctx.options.state;
      let result: ActivityType;

      if (random) {
        if (!ctx.client.isActivityRandom) ctx.client.ChangeActivityRandom();
        return ctx.write({ embeds: [{ title: "Custom activity", description: "La activity random se activo" }] });
      }

      if (ctx.client.isActivityRandom) ctx.client.ChangeActivityRandom();

      if (!type && !name && !state) {
        return ctx.write({ embeds: [{ title: "Custom activity", description: "No se ha proporcionado ningun tipo de activity" }] });
      }
      const options = ["competing", "custom", "listening", "playing", "streaming", "watching"];
      
      switch (String(snap(options, type as string))) {
        case "competing":
          result = ActivityType.Competing;
          break;
        case "custom":
          result = ActivityType.Custom;
          break;
        case "listening":
          result = ActivityType.Listening;
          break;
        case "playing":
          result = ActivityType.Playing;
          break;
        case "streaming":
          result = ActivityType.Streaming;
          break;
        case "watching":
          result = ActivityType.Watching;
          break;     
        default:
          return ctx.write({ embeds: [{ title: "Custom activity", description: `El tipo de activity no es valido, los tipos validos son: \n ${options.map((x) => `- ${x}`).join("\n")}` }] }); 
      }

      setActivity(ctx.client, result, name as string, state as string);
      ctx.write({ embeds: [{ title: "Custom activity", thumbnail: { url: ctx.client.me.avatarURL({ extension: "png", forceStatic: true }) }, color: ctx.client.config.colors.enderbotColor, description: `La activity cambio esto: \n ***Type***: ${String(snap(options, type as string))} \n ***Name***: ${name} \n ***Message***: ${state}` }] });
    } catch (e) {
      console.error(e);
    }

  }
}