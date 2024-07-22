import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Discord, { type DiscordProfile } from "next-auth/providers/discord"
import { db } from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
	//@ts-ignore
	adapter: PrismaAdapter(db),
	providers: [
		Discord({
			profile: (profile: DiscordProfile) => {
				if (profile.avatar === null) {
					const defaultAvatarNumber =
						profile.discriminator === "0"
							? Number(BigInt(profile.id) >> BigInt(22)) % 6
							: parseInt(profile.discriminator) % 5
					profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
				} else {
					const format = profile.avatar.startsWith("a_") ? "gif" : "png"
					profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
				}
				return {
					id: profile.id,
					discordId: profile.id,
					name: profile.global_name ?? profile.username,
					email: profile.email,
					image: profile.image_url
				}
			}
		})
	]
})

declare module "next-auth" {
	interface User {
		discordId: string
		points?: number
		isAdmin?: boolean
	}
}
