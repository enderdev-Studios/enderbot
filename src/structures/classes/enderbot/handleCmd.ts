import { HandleCommand } from "seyfert/lib/commands/handle.js";
import { Yuna } from "yunaforseyfert";

export class enderbotHCmd extends HandleCommand implements HandleCommand {
    override argsParser = Yuna.parser({
        syntax: {
            namedOptions: ["-"],
        },
    });
    override resolveCommandFromContent = Yuna.resolver({
      client: this.client,
      afterPrepare: (metadata) => {
          this.client.logger.debug(`Ready to use ${metadata.commands.length} commands !`);
      },
  });

}

