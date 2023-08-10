import { PropsWithClassName } from "@/lib/types/common"
import { Game, Match, Team } from "@prisma/client"
import { twMerge } from "tailwind-merge"
import { TeamWinrateElement } from "./TeamWinrateElement"

interface TeamWinrateProps {
    data: {
        opponent: Team,
        matches: (Match & {
            games: Game[]
        })[]
    }[]
}

export function TeamWinrate({
    className,
    data
}: PropsWithClassName<TeamWinrateProps>) {
    return <div
        className={twMerge(
            "bg-custom-blue-200 border border-gray-700 border-opacity-60 p-2 rounded-lg flex flex-col gap-2",
            className
        )}>
        {data.length !== 0 && data.map((line, index) => {
            const games = line.matches.flatMap(match => match.games)
            const avgLength = games.reduce((total, game) => total + game.length!, 0) / games.length
            const nbMatches = line.matches.length
            const winrate = line.matches.reduce((total, match) => match.winner_id !== line.opponent.id ? total + 1 : total, 0)
            return <TeamWinrateElement opponent={line.opponent} avgLength={avgLength} nbMatches={nbMatches} winrate={winrate * 100} key={index} />
        })}
    </div>
}