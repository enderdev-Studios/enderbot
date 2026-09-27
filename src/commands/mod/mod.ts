import { AutoLoad, Command, Declare, Middlewares,} from "seyfert";
import { Categories } from "#enderbot/types";

@Declare({
    name: "mod",
    description: "Categoria de comandos moderacion",
    integrationTypes: ["GuildInstall"],
    props: {
        category: Categories.mod,
        usage: "mod"
    },
})
@Middlewares(["CheckBots"])
@AutoLoad()
export default class modCommand extends Command {}