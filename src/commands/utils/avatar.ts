import { type CommandContext, createUserOption, Declare, SubCommand, Options, Embed, Middlewares, } from "seyfert";
import { Shortcut, Watch, Yuna } from "yunaforseyfert";
import { Categories } from "#enderbot/types";
import { sendMessage } from "#enderbot/utils/functions/functions.js";
import ms from "ms";

const options = { user: createUserOption({ description: "get a user" }) }; // Define options

@Declare({
    name: "avatar",
    description: "obtener el avatar de un usuario",
    integrationTypes: ["GuildInstall", "UserInstall"],
    props: {
        category: Categories.util,
        usage: "avatar -user <user>"
    }
})
@Options(options)
@Middlewares(["CheckBots"])
@Shortcut()
export default class AvatarCommand extends SubCommand {  // Watcher to monitor command usage
    override async run(ctx: CommandContext<typeof options>) {
        const user = ctx.options.user || ctx.member; // Get the user or default to the author
        const embed = new Embed().setTitle(`Avatar de **${user?.globalName}**`).setImage(user?.avatarURL({ size: 1024  })).setColor(ctx.client.config.colors.enderbotColor); // Create embed with avatar
        sendMessage(ctx, { embeds: [embed] }); // Send the embed as a message
    }
}