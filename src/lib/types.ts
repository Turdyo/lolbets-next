import { Bet, Game, Match, Team } from "@prisma/client"

export type PropsClass<Props = unknown> = Props & { class?: string }

export type MatchesOrdered = ({
    date: Date,
    matches: (Match & {
        games: Game[],
        opponents: Team[],
        bets: Bet[]
    })[]
})[]