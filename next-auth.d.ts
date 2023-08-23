import { Bet } from "@prisma/client"
import "next-auth"
import "next-auth/providers/discord"

declare module "next-auth" {
    interface User {
        discordId: string
        points?: number
        bets?: Bet[]
    }
    interface Profile {
        discordId: string
    }
    interface Session {
        discordId: string
    }
}


declare module "next-auth/providers/discord" {
    interface DiscordProfile {
        global_name?: string
    }
}