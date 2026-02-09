import { AnyContext, Embed, Message, WebhookMessage } from "seyfert";
import { EmbedColors, PermissionStrings } from "seyfert/lib/common/index.js";
import { FormatOptionType } from "./Formatters.js";
import { APIEmbedField, ApplicationCommandOptionType, MessageFlags } from "seyfert/lib/types/index.js";
import { webhookToken, webhookId } from "../constants/Constants.js";

interface ObjType { name: string, description: string, type: ApplicationCommandOptionType }

export async function onRunError(ctx: AnyContext, error: unknown) {
    const embed = new Embed()
        .setTitle("Error en la Ejecucion")
        .setThumbnail(ctx.client.me.avatarURL({extension: "png", forceStatic: true}))
        .setColor(ctx.client.config.colors.errorColor)
        .setDescription("Hubo un error intentalo mas tarde")
        .setTimestamp();
    const embedError = new Embed()
        .setTitle("Error en la Ejecucion")
        .setThumbnail(ctx.client.me.avatarURL({extension: "png", forceStatic: true}))
        .setColor(ctx.client.config.colors.errorColor)
        .setDescription(`${String(error).slice(0, 248)}`)
        .setTimestamp();
        
        ctx.client.logger.error("Error");
    ctx.client.logger.error(error);
    await ctx.write({ embeds: [embed] });
    return ctx.client.webhooks.writeMessage(webhookId, webhookToken, {
        body: { embeds: [embedError] },
    });
}

export async function onOptionsError(ctx: AnyContext): Promise<Message | WebhookMessage | void> {
    if (!ctx.isChat()) return;
    const command = ctx.command.toJSON();
    const missing = command.options.filter(opt => opt.required && !(opt.name in ctx.options));
    const arr: ObjType[] = [];
    missing.forEach((x) => {
        const obj = {} as ObjType;
        obj["name"] = x.name;
        obj["type"] = FormatOptionType(x.type);
        obj["description"] = x.description;
        arr.push(obj);
    });
    const newarr: APIEmbedField[] = arr.map(({ name, type, description }) => { 
        const Obj: APIEmbedField = {
            name: `**${name}**`,
            value: `***Descripcion:*** ${description} \n***Tipo***: ${type}`
        };
        return Obj;
    });
    const embed = new Embed()
    .setColor(EmbedColors.Fuchsia)
    .setThumbnail(ctx.client.me.avatarURL({extension: "png", forceStatic: true}))
    .setTitle("Error | Falta de Opciones")
    .setDescription(`Intentaste ejecutar ${ctx.fullCommandName} pero te faltaron Algunas opciones  \n\n### Las Opciones faltantes son:`)
    .addFields(newarr)
    .setFooter({ text: "recuerda Poner todos los campos faltantes"});

    return ctx.write({ embeds: [embed] });
}

// Permisos errores

export async function onPermissionsFail(ctx: AnyContext, permissions: PermissionStrings): Promise<Message | WebhookMessage | void> {
    const embed = new Embed()
    .setTitle("Error | Permisos faltantes")
    .setThumbnail(ctx.client.me.avatarURL({extension: "png", forceStatic: true}))
    .setDescription("te faltan permisos necesarios")
    .setColor(ctx.client.config.colors.errorColor)
    .setFields([
        {
            name: "### Te faltan estos Permisos",
            value: permissions.toLocaleString()
        }
    ]);

    await ctx.write({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
export async function onBotPermissionsFail(ctx: AnyContext, permissions: PermissionStrings): Promise<Message | WebhookMessage | void> {
    const embed = new Embed()
    .setTitle("Error | Permisos faltantes")
    .setThumbnail(ctx.client.me.avatarURL({extension: "png", forceStatic: true}))
    .setDescription("Me faltan unos permisos")
    .setColor(ctx.client.config.colors.errorColor)
    .setFields([
        {
            name: "### Te faltan estos Permisos",
            value: permissions.toLocaleString()
        }
    ]);

    await ctx.write({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
