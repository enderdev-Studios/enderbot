import { Client, LimitedMemoryAdapter } from "seyfert";
import { enderbotConfig } from "./classes/enderbot/Config.js";
import { Categories, enderbotConfigType } from "#enderbot/types";
import { enderbotHCmd } from "./classes/enderbot/handleCmd.js";
import { middlewares } from "./utils/utils/Middlewares.js";
import { onRunError, onOptionsError, onBotPermissionsFail, onPermissionsFail } from "./utils/functions/defaults.js";
import { enderbotDatabase } from "./classes/enderbot/enderbotDB.js";
import ms from "ms";

export class enderbot extends Client<true> {
    db: enderbotDatabase = new enderbotDatabase(this);
    config: enderbotConfigType = new enderbotConfig();
    isActivityRandom: boolean = true; // -> Esto permite que la activity pueda ser random o no desde el comando customact :D
    constructor() {
        super({
            commands: {
                prefix: () => { return this.config.prefix; }, defaults: {
                    onRunError, onOptionsError, onBotPermissionsFail, onPermissionsFail,
                    props: { category: Categories.none, usage: "No se" }
                }
            }
        });
    }
    ChangeActivityRandom() {
        this.isActivityRandom = !this.isActivityRandom;
    }
    async run() {
        this.setServices({ handleCommand: enderbotHCmd, middlewares: middlewares, cache: { adapter: new LimitedMemoryAdapter({
                    member: {
                        expire: ms("10min"),
                        limit: 50,
                    }
                }),disabledCache: { voiceStates: true, stageInstances: true, stickers: true, emojis: true } }});
        await this.start();
        await this.uploadCommands();
        this.logger.info("Already nicely uploaded all commands, events and components.");
    }
    async reload() {
        await this.logger.warn("Reloading all commands, events and components...");
        try {
            await this.commands?.reloadAll();
            await this.uploadCommands();
            await this.events?.reloadAll();
            await this.components?.reloadAll();
            await this.commands?.reloadAll();
        } catch (e) {
            this.logger.error(e);
            this.logger.info("Something was wrong while reloading, please check the error above.");
        }
    }
}

