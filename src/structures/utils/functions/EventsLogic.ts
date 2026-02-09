import { ConfigFlags } from "../constants/ConfigFlags.js";


export {
    antilinkFilter,
    autoTagMessage,
    crossPostMessage,
    mentionMessage
};
const link = /(https?:\/\/)?(www|yout\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;

async function antilinkFilter({ guildData, antilinkData, message, client }) {
    if (!guildData || !(guildData.config! & ConfigFlags.AntiLinkFilter)) return;

    const roles = message.member?.roles.keys || [];
    // Check for exceptions 
    if (antilinkData?.MembersExceptions.includes(message.author.id) || antilinkData?.RolesExceptions.some(roleId => roles.includes(roleId))) return 0;
    if (!link.test(message.content) || message.content.match(".destroy") || message.content.match("@everyone")) return 0;
    // Delete message and notify user
    if (guildData.channelId) await client.messages.write(guildData.channelId, { content: `Mensaje con link eliminado de ${message.author.tag} en ${message.guild?.name}` });
    message.write({ content: "Hola por favor no mandes links" }).then(m => { setTimeout(async () => { await m.delete(); }, 4000); });
    await message.delete();
}
function mentionMessage({ guildData, message, client }) {
    if (!guildData) return;
    // Mention Message 
    if (message.content.startsWith(`<@${client.me.id}>`)) {
        if (!(guildData.config & ConfigFlags.MentionBot)) return 0;
        if (message.author.bot) return 0;
        message.reply({ content: `hola este es mi prefix es: ${client.config.prefix.join(", ")}` });
    }

}
function autoTagMessage({ autoTagData, message, channel }) {
    if (!autoTagData) return;
    if (channel.id !== autoTagData.channelId) return;
    if (message.author.bot) return;
    message.write({ content: `tag: <@&${autoTagData.roleId}>` });
}
function crossPostMessage({ crossPostData, message, channel }) {
    if (!crossPostData) return;
    if (!crossPostData.channelIds.includes(channel.id) && !channel.isNews()) return;
    message.crosspost();

}