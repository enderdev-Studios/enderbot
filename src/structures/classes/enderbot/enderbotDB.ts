// eslint-disable @typescript-eslint/no-explicit-any
import { enderbot } from "#enderbot/client";
import { PrismaClient } from "#enderbot/prisma";
const prismaClient = new PrismaClient();
export class enderbotDatabase {
    /**
     * The database client instance.
     * @type {PrismaClient}
     * @readonly
     */

    readonly prisma: PrismaClient = prismaClient;
    readonly client: enderbot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(client: any) {
        this.client = client;   
    }
     async connect() {
        try {
            await this.prisma.$connect();
            this.client.logger.info("Database connected successfully");
        } catch (error) {
            this.client.logger.fatal("Error connecting to the database: ", error);
        }
    }

    async disconnect() {
        try {
            await this.prisma.$disconnect();
            this.client.logger.info("Database disconnected successfully");
        } catch (error) {
            this.client.logger.fatal("Error disconnecting from the database: ", error);
        }
    }
}