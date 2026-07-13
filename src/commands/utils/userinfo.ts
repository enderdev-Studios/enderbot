import { AttachmentBuilder, createUserOption, Declare, Embed, Middlewares, Options, CommandContext, SubCommand  } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import { Shortcut, Watch, Yuna } from "yunaforseyfert";
import { profileImage } from "discord-arts";
import { UsualColors } from "#enderbot/utils/constants/Constants.js";
import { sendMessage } from "#enderbot/utils/functions/functions.js";
import ms from "ms";

// Define options for the command
const options = { user: createUserOption({ description: "get a user", required: false, })};

@Declare({
    name: "userinfo",
    description: "Información sobre un usario",
    integrationTypes: ["GuildInstall", "UserInstall"]
})
@Options(options)
@Middlewares(["CheckBots"])
@Shortcut()
export default class UserinfoCommand extends SubCommand {
    @Watch({
        idle: ms("1min"),
        beforeCreate(ctx) { const watcher = Yuna.watchers.find(ctx.client, { userId: ctx.author.id, command: this }); if (!watcher) return; watcher.stop("Just execute"); }, 
    })
    override async run(ctx: CommandContext<typeof options>) {
        const user = ctx.options.user || ctx.author; // Get the user from options or default to the command author
        const userinfoArr = [
            { name: "Username", value: `${user.username}`, inline: true },
            { name: "GlobalName", value: `${user.globalName || "no tiene ningun apodo"}`, inline: true },
            { name: "Id:", value: `${user.id}`, inline: false },
            { name: "Creacion de la cuenta:", value: `${user.createdAt.toLocaleDateString()}`, inline: true}
        ]; // Array to hold user info fields
        const banner = user.bannerURL({ forceStatic: true });
        const img = await profileImage(user.id, { customBackground: banner, moreBackgroundBlur: true, borderColor: UsualColors.Color });
        const attachment = new AttachmentBuilder({ filename: "userimage.png" }).setFile("buffer", img);
        const embed = new Embed()
            .setTitle(`informacion de ${user.username}`)
            .setThumbnail(user.avatarURL({ extension: "png" }))
            .setColor(ctx.client.config.colors.enderbotColor)
            .setImage("attachment://userimage.png");
        // Creation of the embed message
        try {
            const member = await (await ctx.guild())?.members.fetch(user.id);
            const roles = (await member?.roles.list())?.sort((a, b) => b.position - a.position).map(roles => roles.toString()).slice(0, -1) as string[];
            if (!roles) return sendMessage(ctx, { embeds: [embed.addFields(userinfoArr)], files: [attachment] });
            const displayRoles = roles.length < 1 ? "no tiene roles" : roles.join(", ");
            const data = new Date(member?.joinedAt as string); // Fetch the member's join date
            // Add member-specific info to the array
            userinfoArr.push({ name: "Ingreso al servidor:", value: `${data.toLocaleDateString()}`, inline: true }, { name: `Roles (${roles.length})`, value: displayRoles, inline: false });

            sendMessage(ctx, { embeds: [embed.addFields(userinfoArr)], files: [attachment] });
        } catch (e: unknown) {
            if (e instanceof Error) {
                if (e.message.match("Unknown Guild 10004")) return sendMessage(ctx, { embeds: [embed.addFields(userinfoArr)], files: [attachment], flags: MessageFlags.Ephemeral });
                else sendMessage(ctx, { content: "Ocurrio un error" }); throw new Error(e.message);
            }
        }
    }
}