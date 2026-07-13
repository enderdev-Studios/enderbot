import { ActivityType } from "seyfert/lib/types/index.js";
import * as pack from "../../../../package.json" with { type: "json" };
process.loadEnvFile(".env");
export const { DATABASE_URL, appID, token, webhookURL, webhookId, webhookToken } = process.env;

export const version = pack.default.version;

export const PrismaVersion = pack.default.devDependencies.prisma;
export const SeyfertVersion = pack.default.dependencies.seyfert;
export const typescriptVersion = pack.default.devDependencies.typescript;


export const bots = [
  "924525977437077515", // <--- endkachu 
  "710034409214181396", // <--- ticket king
  "416358583220043796", // <--- Xenon
  "472911936951156740" // <--- VoiceMaster
];

export const UsualColors = {
  White: 0xf4feff,
  Color: "FFFDBE"
};

export const GithubRepo = "https://github.com/enderdev-v/enderbot";

export const EnviromentKeys = {
  DATABASE_URL,
  token,
  webhookId,
  appID,
  webhookToken,
  webhookURL
};
export const musicName = [
  "Counting Stars - OneRepublic",
  "Por fa no te vayas - Morat",
  "I'm Still Standing - Elton John",
  "Run - OneRepublic",
  "Blinding ligths - The Weekend",
  "Sunflower - Post Malone & Swae Lee",
  "Wake me up - Avicii",
  "Sunburst - Tobu",
];

export const getRandomMusicName = () => { return musicName[Math.floor(Math.random() * musicName.length)]; };
export const activity = [
  {
    name: "Change it",
    type: ActivityType.Listening,
    state: "en un mp3"
  },
  {
    name: "enderbot version",
    type: ActivityType.Custom,
    state: "Currently work in: " + version
  },
  {
    name: "enderbot",
    type: ActivityType.Custom,
    state: "Hey everyone, what's up?"
  },
  {
    name: "Watching servers",
    type: ActivityType.Watching,
    state: "So... I protect some servers"
  },
  {
    name: "seyfert with feith",
    type: ActivityType.Playing,
    state: "I'm playing with seyfert with fire and feith in i wont stop :D"
  }
];

