import { Categories } from "#enderbot/types";
import { ConfigFlags } from "#enderbot/utils/constants/ConfigFlags.js";
import { Declare, SubCommand, type CommandContext, Middlewares, createIntegerOption, createBooleanOption, Options } from "seyfert";
const options = {
  option: createIntegerOption({
    description: "Config Options",
    required: true,
    choices: [
      { name: "ThreadLinkFilter", value: 0 },
      { name: "AntiLinkFilter", value: 1 },
      { name: "BadBotsFilter", value: 2 },
      { name: "BadMemberFilter", value: 3 },
      { name: "MentionBot", value: 4 }
    ]
  }),
  value: createBooleanOption({ description: "Config Value", required: true })
};
@Declare({
  name: "guild",
  description: "configuracion de guild",
  integrationTypes: ["GuildInstall"],
  props:{
    category: Categories.config,
    usage: "guild <option> <value>",
  }
})
@Middlewares(["CheckBots"])
@Options(options)
export default class GuildCommand extends SubCommand {
  override async run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    const option = ctx.options.option;
    const OptionName = Object.keys(ConfigFlags)[option];
    const value = ctx.options.value;
    const data = await ctx.client.db.prisma.configGuild.findUnique({ where: { guildId: ctx.guildId } });
    const flag = ConfigFlags[Object.keys(ConfigFlags)[option] as keyof typeof ConfigFlags];
    if (!data) {
      let config = 0; if (value) config |= flag;
      await ctx.client.db.prisma.configGuild.create({ data: { guildId: ctx.guildId, config: config } });
      return ctx.write({ content: `Configuracion creada de "***${OptionName}***" seteado a ***${value}***` });
    }
    const currentConfig = data.config ?? 0;
    const newConfig = value ? (currentConfig | flag) : (currentConfig ^ flag);
    await ctx.client.db.prisma.configGuild.upsert({ where: { guildId: ctx.guildId }, update: { config: newConfig }, create: { guildId: ctx.guildId, config: newConfig } });
    return ctx.write({ content: `Configuracion Actualizada de  "***${OptionName}***" seteado a ***${value}***` });
  }
}