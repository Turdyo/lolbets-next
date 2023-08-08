import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import 'dotenv/config'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/prisma";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
      profile(profile: DiscordProfile & { global_name: string }) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = Math.floor(Math.random() * 6);
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png"
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
        }
        return {
          id: profile.id,
          discordId: profile.id,
          name: profile.global_name,
          image: profile.image_url,
        }
      },
    }),
  ],
  session: {
    maxAge: 7 * 24 * 60 * 60
  },
  events: {
    createUser({ user }) {
      const discordUser = user as unknown as User
      console.log("user created", discordUser)
    },
    signIn: async ({ profile }) => {
      const newData = profile as unknown as User
      await db.user.update({
        where: {
          discordId: newData.discordId!
        },
        data: newData
      })
    }
  },
  callbacks: {},
  pages: {
    error: "/",
    signIn: "/",
    verifyRequest: "/"
  }
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
