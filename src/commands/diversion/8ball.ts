import { type CommandContext, Declare, Command, Options, createStringOption, Embed, Middlewares, } from "seyfert";

import { Categories } from "#enderbot/types";
import { sendMessage } from "#enderbot/utils/functions/functions.js";

// Define options for the command
const options = { question: createStringOption({ description: "the question to ask the 8ball", required: true }) };

@Declare({
    name: "8ball",
    description: "Prueba tu suerte",
    integrationTypes: ["GuildInstall", "UserInstall"],
    props: {
        usage: "8ball -question <question>",
        category: Categories.fun
    }
})
@Options(options)
@Middlewares(["CheckBots"])
export default class BallCommand extends Command { 
    override async run(ctx: CommandContext<typeof options>) {
        // Get the question from options
        const question = ctx.options.question;
        if (!question) return sendMessage(ctx, { content: "Preguntame algo🎱 no seas timido" });
        // PseudoRandom answer selection        
        const Ball = ["si", "no", "quiziera comprobarlo", "por supuesto", "claro que no", "muy cierto", "que dijiste", "claro que si"];
        const Aleatorio = Math.floor(Math.random() * (Ball.length));
        // Create and send embed with the question and answer
        const embed = new Embed().setTitle("🎱 8Ball Question").setDescription("Pregunta: \n " + question).addFields({ name: "Respuesta:", value: Ball[Aleatorio] });
        sendMessage(ctx, { embeds: [embed] });
    }
}