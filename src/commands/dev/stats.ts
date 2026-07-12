import { Declare, Command, type CommandContext,  Middlewares, Embed } from "seyfert";
import { SeyfertVersion, typescriptVersion, PrismaVersion } from "#enderbot/utils/constants/Constants.js";
import { cpuUsage, memoryUsage } from "#enderbot/utils/functions/functions.js";
import { Categories } from "#enderbot/types";

@Declare({
  name: "botstats",
  description: "Informacion de desarrollo de enderbot",
  aliases: ["devnnfo", "dev"],
  props: {
    category: Categories.dev,
    usage: "botstats"
  }
})
@Middlewares(["Onlydev", "CheckBots"])
export default class DevInfoCommand extends Command {
  override async run(ctx: CommandContext) {

        const embed = new Embed()
            .setTitle("***Informacion de enderbot***")
            .setThumbnail(ctx.client.me.avatarURL({ forceStatic: true }) as string)
            .setColor(ctx.client.config.colors.enderbotColor as number)
            .setDescription("***Hola dev que tal como estas aqui te doy un resumen para que no entres a otros lados :D***")
            .setFields([
                 {

                    name: "Lenguaje:",
                    value: `\`\`\`ts\n "Typescript" ver. ${typescriptVersion} \n \`\`\``,
                    inline: false
                },
                {
                    name: "**Librerias:**",
                    value: `* Seyfert **v${SeyfertVersion}** \n* Prisma **v.${PrismaVersion}** \n* Canvas **2.10.0**`,
                    inline: true
                },
                {
                    name: "**Stats**",
                    value: `>>> **RAM Usage:** **__${memoryUsage()}__** \n **CPU Usage** **__${cpuUsage().join(" ")}__**`,
                    inline: true
                }
            ]);

        await ctx.write({ embeds: [embed] });
    
  }
}