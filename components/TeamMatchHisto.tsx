import { PropsWithClassName } from "@/lib/types/common";
import { Game, Match as MatchType, Team } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/fr"
import { Match } from "@/components/Match";
import { twMerge } from "tailwind-merge";

interface TeamMatchHistoProps {
    matchesOrdered: ({
        date: Date,
        matches: (MatchType & {
            games: Game[],
            opponents: Team[]
        })[]
    })[],
    team_id: number
}


export function TeamMatchHisto({
    className,
    matchesOrdered,
    team_id
}: PropsWithClassName<TeamMatchHistoProps>) {
    return (
        <div className={twMerge(
            "flex flex-col basis-3/5",
            className
        )}>
            {matchesOrdered.map((matchOrdered, index) => (
                <div key={index} className="mt-2">
                    <span className="font-semibold text-custom-white-200">{dayjs(matchOrdered.date).format("dddd D MMMM")}</span>
                    {matchOrdered.matches.map((match, index) => {
                        const isFinished = match.status === "finished"
                        const isWinner = match.winner_id && match.winner_id === team_id
                        return <Match match={match} key={index} className={twMerge(
                            "rounded-md",
                            isFinished ? isWinner ? "bg-custom-blue-300 border-l-[6px] border-l-custom-blue-400" : "bg-custom-red-300 border-l-[6px] border-l-custom-red-400" : ""
                        )} />
                    })}
                </div>
            ))}
        </div>
    )
}