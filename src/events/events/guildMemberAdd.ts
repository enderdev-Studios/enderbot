import { ConfigFlags } from "#enderbot/utils/constants/ConfigFlags.js";
import { createEvent } from "seyfert";

export default createEvent({
    data: { name: "guildMemberAdd" },
    async run(member, client) {
        // Bad Bots Logic
        const guildConfig = await client.db.prisma.configGuild.findUnique({ where: { guildId: member.guildId } });
        const BadBotsdata = await client.db.prisma.badBots.findUnique({ where: { guildId: member.guildId } });
        if((!BadBotsdata || !guildConfig) || !(guildConfig.config & ConfigFlags.BadBotsFilter)) return; 
        if (!BadBotsdata.bots.includes(member.id)) return;
        if (guildConfig.channelId) await client.messages.write(guildConfig.channelId, { content: `bot baneado como ${member.user.tag} en ${member.guild.name}`, });
        await member.ban({ deleteMessageSeconds: 0, reason: "Este bot está catalogado como malo o malicioso" }).catch(e => { client.logger.error("Error banning bad bot:", e); });
    }
});