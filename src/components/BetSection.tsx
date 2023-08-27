"use client"
import { bet } from "@/lib/bet"
import { BetInput } from "./ui/BetInput"
import { Status } from "@prisma/client"
import { twMerge } from "tailwind-merge"
import { useLeaderboard } from "@/hooks/useLeaderboard"

type BetProps = {
    matchId: number
    team1Id: number
    team2Id: number
    status: Status
    onBet?: () => void
} & ({ hasBets: false } | { hasBets: true, team1BetsPercent: number, team2BetsPercent: number })

export function BetSection({
    matchId,
    team1Id,
    team2Id,
    status,
    onBet,
    ...props
}: BetProps) {
    const { refetch: refetchLeaderboard } = useLeaderboard()

    if (status !== "not_started" && !props.hasBets) {
        return <div className="h-14 m-2 w-72"></div>
    }

    return <div className={twMerge(
        "flex justify-center gap-4 items-center h-14 m-2 w-72",
        (status === "finished" || status === "running") ? 'mt-0' : ""
    )}>
        <div className="w-36">
            {status === "not_started" && <BetInput
                color="red"
                onClick={(amount) => bet({
                    amount: amount,
                    matchId: matchId,
                    teamId: team1Id
                })
                    .then(resp => {
                        refetchLeaderboard()
                        onBet && onBet()
                    })
                    .catch(error => console.log(error))}
            />}
            {props.hasBets && <div className="text-xl font-bold text-custom-red-400 flex flex-col items-end">
                {props.team1BetsPercent.toFixed()} %
                <div className="h-2 bg-custom-red-400 rounded-xl" style={{ width: (120 * props.team1BetsPercent) / 100 }}></div>
            </div>}
        </div>
        <div className="h-full w-px bg-gray-600 bg-opacity-60 mt-1"></div>
        <div className="w-36">
            {status === "not_started" && <BetInput
                color="blue"
                onClick={(amount) => bet({
                    amount: amount,
                    matchId: matchId,
                    teamId: team2Id
                })
                    .then(resp => {
                        refetchLeaderboard()
                        onBet && onBet()
                    })
                    .catch(error => console.log(error))}
            />}
            {props.hasBets && <div className="text-xl font-bold text-custom-blue-400 rounded-xl">
                {props.team2BetsPercent.toFixed()} %
                <div className="h-2 bg-custom-blue-400 rounded-xl" style={{ width: (120 * props.team2BetsPercent) / 100 }}></div>
            </div>}
        </div>
    </div>
}