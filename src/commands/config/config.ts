import { AutoLoad, Command, Declare, Middlewares,} from "seyfert";
import { Categories } from "#enderbot/types";

@Declare({
    name: "config",
    description: "Categoria de comandos configuracion",
    integrationTypes: ["GuildInstall"],
    props: {
        category: Categories.config,
        usage: "config"
    },
})
@Middlewares(["CheckBots"])
@AutoLoad()
export default class ConfigCommand extends Command {}