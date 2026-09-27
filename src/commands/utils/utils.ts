import { AutoLoad, Command, Declare, Middlewares,} from "seyfert";
import { Categories } from "#enderbot/types";

@Declare({
    name: "utils",
    description: "Categoria de comandos utilitarios",
    integrationTypes: ["GuildInstall", "UserInstall"],
    props: {
        category: Categories.util,
        usage: "utils"
    },
})
@Middlewares(["CheckBots"])
@AutoLoad()
export default class UtilCommand extends Command {}