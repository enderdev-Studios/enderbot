import { config } from "seyfert";
process.loadEnvFile(".env");

const token = String(process.env.token);
const applicationId = String(process.env.appID);
const dir = process.argv[1].includes("dist") ? "dist" : "src";

if (!token) throw new Error("No pusiste el token");
if (!applicationId) throw new Error("No pusiste la application id");
    
const seyfert = config.bot({
    token: token,
    intents: ["Guilds", "MessageContent", "GuildMessages", "GuildMembers", "GuildWebhooks", ],
    locations: {
        base: dir,
        commands: "commands",
        events: "events",
    }, 
    applicationId
 });
export default seyfert;