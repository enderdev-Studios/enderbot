import { ParseClient } from "seyfert";
import type { enderbot } from "#enderbot/client";
import { middlewares } from "#enderbot/utils/utils/Middlewares.js";

declare module 'seyfert' {
	interface SeyfertRegistry { 
		client: ParseClient<enderbot>; 
		middlewares: typeof middlewares;

	}
	interface InternalOptions {
		withPrefix: true;
	}
	interface ExtraProps {
		category?: Categories;
		usage?: string;
	}
}


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