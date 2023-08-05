import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord";
import 'dotenv/config'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // DiscordProvider({
    //     clientId: process.env.
    // })
  ],
}

export default NextAuth(authOptions)