"use client"
import { MatchesOrdered, PropsWithClassName } from "@/lib/types/common";
import { MatchComponent } from "./MatchComponent";
import { twMerge } from "tailwind-merge";
import { useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { getClosestDay } from "@/lib/utils";
import { ArrowUp } from "lucide-react";

dayjs.locale("fr")

type MatchesProps = {
    matchesOrdered: MatchesOrdered,
} & ({ mode: 'team', team_id: number } | { mode: 'league' })

export function Matches(props: PropsWithClassName<MatchesProps>) {
    const className = props.className
    const matchesOrdered = props.matchesOrdered
    const mode = props.mode
    
    const closestDayBox = useRef<HTMLDivElement>(null)
    useEffect(() => {
        closestDayBox.current?.scrollIntoView({
            behavior: "smooth",
        })
    }, [])
    
    const today = useMemo(() => dayjs(), [])
    const closestIndex = useMemo<number>(() => {
        return getClosestDay(matchesOrdered, today.toDate())
    }, [today, matchesOrdered])
    
    if (matchesOrdered.length === 0) {
        return <div className={twMerge("text-center p-14", className)}>
            Pas de Matchs
        </div>
    }

    return <div className={twMerge(
        "p-14 flex flex-col gap-2 overflow-auto",
        className
    )} >
        {matchesOrdered.map((matchOrdered, index) => {
            const isToday = dayjs(matchOrdered.date).isSame(today, 'day')
            const hasPassedMatches = closestIndex > 0
            const isClosest = index === closestIndex && hasPassedMatches
            return <div key={index} className="w-full" ref={isClosest ? closestDayBox : undefined}>
                <span className={twMerge(
                    "font-semibold text-custom-white-200",
                    isToday ? "text-custom-yellow-200" : ""
                )}>
                    <div className="flex justify-between">
                        {
                            isToday ? <>Aujourd&apos;hui</>
                                : <>{dayjs(matchOrdered.date).format("dddd D MMMM")}</>
                        }
                        {
                            isClosest && <div className="flex gap-2 text-custom-yellow-100 items-center">
                                <ArrowUp className="animate-bounce" size={20} />
                                Résultats passés
                            </div>
                        }
                    </div>
                </span>

                <div className="flex flex-col gap-2">
                    {matchOrdered.matches.map((match, index) => {
                        if (mode === "team") {
                            const isFinished = match.status === "finished"
                            const isWinner = match.winner_id && match.winner_id === props.team_id
                            return <MatchComponent match={match} key={index} className={twMerge(
                                "rounded-md",
                                isFinished ? isWinner ? "bg-custom-blue-300 border-l-[6px] border-l-custom-blue-400" : "bg-custom-red-300 border-l-[6px] border-l-custom-red-400" : ""
                            )} />
                        } else if (mode === "league") {
                            return <MatchComponent match={match} key={index} />
                        }
                    })}
                </div>
            </div>
        })}
        <div className="min-h-[calc(100vh-112px)]"></div>
    </div>
}