import { ConfigFlags } from "#enderbot/utils/constants/ConfigFlags.js";
import { createEvent } from "seyfert";
const link = /(https?:\/\/)?(www|yout\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;

export default createEvent({
	data: { name: "messageCreate" },
	async run(message, client) {
		// Mention message
		const ConfigGuildData = await client.db.prisma.configGuild.findUnique({ where: { guildId: message.guildId! } });
		const crossPostData = await client.db.prisma.messageCrossPost.findUnique({ where: { guildId: message.guildId } });
		const autoTagData = await client.db.prisma.autoTag.findUnique({ where: { guildId: message.guildId } });
		const AntilinkData = await client.db.prisma.antilink.findUnique({ where: { guildId: message.guildId! } });
		const channel = await message.channel();
		try {
			// AutoTag Message
			if (autoTagData) {
				if (channel.id === autoTagData.channelId) {
					message.write({ content: `tag: <@&${autoTagData.roleId}>` });
				}
			}
			// Crosspost Message
			if (crossPostData) {
				if (crossPostData.channelIds.includes(channel.id) && channel.isNews()) { message.crosspost(); }
			}
			
			// Antilinks Filter
			if (!ConfigGuildData) return;
			// Mention Message 
			if (message.content.startsWith(`<@${client.me.id}>`)) {
				if (!(ConfigGuildData.config & ConfigFlags.MentionBot)) return 0;
				if (message.author.bot) return 0;
				message.reply({ content: `hola este es mi prefix es: ${client.config.prefix.join(", ")}` });
			}

			if (!(ConfigGuildData.config! & ConfigFlags.AntiLinkFilter)) return 0;
			const roles = message.member?.roles.keys || [];
			// Check for exceptions 
			if (AntilinkData?.MembersExceptions.includes(message.author.id) || AntilinkData?.RolesExceptions.some(roleId => roles.includes(roleId))) return 0;
			if (!link.test(message.content) || message.content.match(".destroy") || message.content.match("@everyone")) return 0;
			// Delete message and notify user
			if (ConfigGuildData.channelId) await client.messages.write(ConfigGuildData.channelId, { content: `Mensaje con link eliminado de ${message.author.tag} en ${message.guild?.name}` });
			message.write({ content: "Hola por favor no mandes links" }).then(m => { setTimeout(async () => { await m.delete(); }, 4000); });
			await message.delete();
			// Catch errors
		} catch (error) { client.logger.error(error); }
	}
});