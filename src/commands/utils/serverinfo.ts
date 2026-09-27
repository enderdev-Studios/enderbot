import { Middlewares, Declare, Embed, CommandContext, SubCommand } from "seyfert";
import { ChannelType, GuildVerificationLevel, MessageFlags } from "seyfert/lib/types/index.js";
import { Shortcut, Watch, Yuna } from "yunaforseyfert";
import ms from "ms";
import { Categories } from "#enderbot/types";

@Declare({
  name: "serverinfo",
  description: "Displays information about the server",
  props: {
    category: Categories.util,
    usage: "serverinfo"
  },
})
@Middlewares(["CheckBots"])
@Shortcut()
export default class ServerinfoCommand extends SubCommand {
  @Watch({
    idle: ms("1min"),
    beforeCreate(ctx) { const watcher = Yuna.watchers.find(ctx.client, { userId: ctx.author.id, command: this }); if (!watcher) return; watcher.stop("Just execute"); },
  })
  override async run(ctx: CommandContext) {
    // Declare variables
    const guild = await ctx.guild("cache", { with_counts: true }); if (!guild) return;
    const roles = await guild?.roles.list();
    const nivel = { "0": "Ningúno", "1": "Bajo", "2": "Medio", "3": "Alto", "4": "Muy alto" };
    // Members
    
    const bots = roles.filter(role => role.managed).length;
    const usuarios = guild.memberCount as number  - bots;
    const very = nivel[guild?.verificationLevel as GuildVerificationLevel];

    // Channels
    const channels = await guild.channels.list();
    const texto = channels?.filter(channel => channel.type === ChannelType.GuildText).length;
    const voz = channels?.filter(channel => channel.type === ChannelType.GuildVoice).length;
    const cate = channels?.filter(channel => channel.type === ChannelType.GuildCategory).length;
    const stage = channels?.filter(channel => channel.type === ChannelType.GuildStageVoice).length;
    const foro = channels?.filter(channel => channel.type === ChannelType.GuildForum).length;
    // Create and send embed
    const embed = new Embed()
      .setTitle(`informacion de ${guild?.name}`)
      .setThumbnail(guild?.iconURL())
      .setColor(ctx.client.config.colors.enderbotColor)
      .addFields(
        { name: "**Owner:**", value: `__${await guild?.fetchOwner()}__`, inline: false },
        { name: "**Se creo:**", value: `${guild?.createdAt.toLocaleDateString()}`, inline: false },
        { name: "```Usuarios```", value: `> Miembros en total: **${guild?.memberCount}** \n > Usuarios: **${usuarios}** \n > Bots: ${bots}`, inline: true },
        { name: "```Stats```", value: `> Roles: ${roles.length} \n > Nivel Verificacion: ${very} \n > Canales de texto: ${texto} \n > Canales de voz: ${voz} \n > Canales de escenario: ${stage} \n > Categorias: ${cate} \n > Foros: ${foro}`, inline: true }
      );

    ctx.write({ embeds: [embed], flags: MessageFlags.Ephemeral });


  }
}