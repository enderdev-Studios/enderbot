import { antilinkFilter, autoTagMessage, crossPostMessage, mentionMessage } from "#enderbot/utils/functions/EventsLogic.js";
import { createEvent } from "seyfert";

export default createEvent({
	data: { name: "messageCreate" },
	async run(message, client) {
		const channel = await message.channel();
		// Mention message
		const ConfigGuildData = await client.db.prisma.configGuild.findUnique({ where: { guildId: message.guildId! } });
		const crossPostData = await client.db.prisma.messageCrossPost.findUnique({ where: { guildId: message.guildId } });
		const autoTagData = await client.db.prisma.autoTag.findUnique({ where: { guildId: message.guildId } });
		const AntilinkData = await client.db.prisma.antilink.findUnique({ where: { guildId: message.guildId! } });
		try {
			await autoTagMessage({ autoTagData, message, channel });
			await antilinkFilter({ guildData: ConfigGuildData, antilinkData: AntilinkData, message, client });
			await mentionMessage({ guildData: ConfigGuildData, message, client });
			await crossPostMessage({ crossPostData, message, channel });
			
			// Catch errors
		} catch (error) { client.logger.error(error); }
	}
});