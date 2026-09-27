import { Command, type CommandContext, Declare, Embed, Middlewares, Options, createNumberOption, createStringOption, } from "seyfert";
import { Formatter } from "seyfert/lib/common/index.js";
import { inspect } from "util";
import { getEmoji } from "#enderbot/utils/functions/functions.js";
import { EnviromentKeys } from "#enderbot/utils/constants/Constants.js";
import { Categories } from "#enderbot/types";
const secretsRegex = /\b(?:client\.(?:config)|config|env|process\.(?:env|exit)|eval|atob|btoa)\b/;
const concatRegex = /".*?"\s*\+\s*".*?"(?:\s*\+\s*".*?")*/;
const awaitableRegex = /^(?:\(?)\s*await\b/;
const envRegex = new RegExp(Object.values(EnviromentKeys).map((value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),"g");
const sliceText = (text: string, length: number = 240): string => (text.length > length ? `${text.slice(0, length - 3)}...` : text);
const getInspect = (object: unknown, depth: number = 0): string => inspect(object, { depth });

const options = {
    code: createStringOption({
        description: "Enter some code.",
        required: true,
    }),
    depth: createNumberOption({
        description: "Enter the depth of the result code.",
        required: false,
    }),
};

@Declare({
    name: "eval",
    description: "Simplemente evalua cualquier codigo xd",
    aliases: ["code"],
    defaultMemberPermissions: ["ManageGuild", "Administrator"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
    props: {
    category: Categories.dev,
    usage: "eval -code <code> -depth <depth>"
  }
})
@Options(options)
@Middlewares(["Onlydev", "CheckBots"])
export default class EvalCommand extends Command {
    override async run(ctx: CommandContext<typeof options>) {
        
        // Definitions        
        const now = Date.now();
        let code: string = ctx.options.code;
        let output: string | null = null;
        let typecode: unknown;

        if (ctx.message) await ctx.client.channels.typing(ctx.channelId);
        try {
            if (secretsRegex.test(code.toLowerCase()) || concatRegex.test(code.toLowerCase())) output = "Secret Messages";
            else if (typeof output !== "string") {
                if (awaitableRegex.test(code.toLowerCase())) code = `(async () => ${code})()`;

                output = await eval(code);
                typecode = typeof output;
                output = getInspect(output, ctx.options.depth ?? 0);
                 if (envRegex.test(output)) output = output.replaceAll(envRegex, "✨");

            }
            const embed = new Embed()
                .setTitle(`Codigo Evaluado ${await getEmoji(ctx.client, "java")}`)
                .setColor(ctx.client.config.colors.enderbotColor)
                .setThumbnail(ctx.client.me.avatarURL({extension: "png", forceStatic: true}))
                .setDescription(`## Output \n ${await getEmoji(ctx.client, "seeing")} Al parecer ya evalue tu codigo veamos\n \n${Formatter.codeBlock(sliceText(output, 1900), "js")}`)
                .setThumbnail(ctx.client.me.avatarURL())
                .setTimestamp()
                .addFields(
                    {
                        name: `${await getEmoji(ctx.client, "java")} Type`,
                        value: `${Formatter.codeBlock(String(typecode), "js")}`,
                        inline: true,
                    },
                    {
                        name: "⏳ Evaluated Time",
                        value: `\`\`\`\n${Math.floor(Date.now() - now)}ms\n\`\`\``,
                        inline: true,
                    },
                    {
                        name: `${await getEmoji(ctx.client, "penwinlovets")} Input`,
                        value: `${Formatter.codeBlock(sliceText(ctx.options.code, 1024), "js")}`,
                    },
                );
            await ctx.editOrReply({ embeds: [embed], });
        } catch (e) {
            console.error(e);
            const embed = new Embed()
                .setTitle(`Error ${await getEmoji(ctx.client, "what")}`)
                .setColor(ctx.client.config.colors.errorColor)
                .setThumbnail(ctx.client.me.avatarURL({extension: "png", forceStatic: true}))
                .setDescription(`Al parecer hubo un error algo que se suponia que no debia pasar ${await getEmoji(ctx.client, "blank")} \nPero pues no sirves para nada entonces pues lo esperaba ${await getEmoji(ctx.client, "laugh")}`) // -> es chiste asi es el bot no lo cambien
                .addFields(
                    {
                        name: `${await getEmoji(ctx.client, "java")} Type`,
                        value: `${Formatter.codeBlock(String(typecode), "js")}`,
                        inline: true,
                    },
                    {
                        name: "⏳ Evaluated Time",
                        value: `\`${Math.floor(Date.now() - now)}ms\``,
                        inline: true,
                    },
                    {
                        name: `${await getEmoji(ctx.client, "penwinlovets")} Input`,
                        value: `${Formatter.codeBlock(sliceText(ctx.options.code, 1024), "js")}`,
                    },
                );
            await ctx.editOrReply({ embeds: [embed], });
        }
    }
} // from stelle-music