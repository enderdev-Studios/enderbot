import { enderbot } from "#enderbot/client";
import { middlewares } from "#enderbot/utils/utils/Middlewares.js";
import { ParseClient, ParseMiddlewares } from "seyfert";


// Categories 

export enum Categories { 
	config = "config",
	dev = "dev",
	info = "info",
	mod = "mod",
	fun = "fun",
	util = "util",
	none = "none"
}
// declare

declare module "seyfert" {
	interface InternalOptions {
		withPrefix: true;
	}
	interface UsingClient extends ParseClient<enderbot> { }
	// Registrar los middlewares en los tipos de Seyfert
	interface RegisteredMiddlewares
		extends ParseMiddlewares<typeof middlewares> { }
	interface ExtraProps {
		category?: Categories;
		usage?: string;
	}
	
}

// enderbot configuration

export type enderbotConfigType = {
	colors: {
		enderbotColor: number
		errorColor: number
		checkColor: number
		debugColor: number
		infoColor: number
	}
	devsId: string[]
	ownersId: string[]
	prefix: string[]
	inviteLink: string
}


// enum

export enum LoggerLevel {
	Debug = 0,
	Info = 1,
	Warn = 2,
	Error = 3,
	Fatal = 4,
	check = 5,
	enderbot = 6,
}
export enum LoggerColor {
	infoLogger = "#3f7ede",
	warnLogger = "#D5E413",
	errorLogger = "#E23A3A",
	debugLogger = "#9DEB02",
	FatalLogger = "#940909",
	checkLogger = "#2B802D",
};