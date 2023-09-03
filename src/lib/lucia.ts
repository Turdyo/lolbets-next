import { lucia } from "lucia";
import { web } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { discord } from "@lucia-auth/oauth/providers"
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()

export const auth = lucia({
	env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
	middleware: web(),
	sessionCookie: {
		expires: false
	},
	adapter: prisma(db),
	getUserAttributes: (data) => {
		return {
			discordId: data.discordId,
			points: data.points,
			image_url: data.image_url,
			name: data.name,
		}
	}
});


export const discordAuth = discord(auth, {
	clientId: process.env.DISCORD_CLIENT_ID!,
	clientSecret: process.env.DISCORD_CLIENT_SECRET!,
	redirectUri: process.env.NODE_ENV === "production" ? "https://lolbets.4esport.fr/api/login/discord/callback" : "http://localhost:3000/api/login/discord/callback"
})

export type Auth = typeof auth;