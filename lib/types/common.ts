import { Bet, Game, Match, Team } from "@prisma/client"

export type PropsWithClassName<Props = unknown> = Props & { className?: string }


export type MatchesOrdered = ({
    date: Date,
    matches: (Match & {
        games: Game[],
        opponents: Team[],
        bets: Bet[]
    })[]
})[]
