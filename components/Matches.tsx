"use client"
import { MatchesOrdered, PropsWithClassName } from "@/lib/types/common";
import { MatchComponent } from "./MatchComponent";
import { twMerge } from "tailwind-merge";
import { useEffect, useMemo, useRef, useState } from "react";
import { getClosestDay, getMatchesOrdered } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { GetMatches } from "@/lib/query";
import { useMatches } from "@/hooks/useMatches";
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { usePoints } from "@/hooks/usePoints";

dayjs.locale("fr")

type MatchesProps = {
    fetchUrl: string,
    initialData: GetMatches
} & ({ mode: 'team', team_id: number } | { mode: 'league' } | { mode: 'homepage' })

export function Matches({
    initialData,
    className,
    fetchUrl,
    ...props
}: PropsWithClassName<MatchesProps>) {
    const mode = props.mode

    const { data: matches, refetch } = useMatches({ url: fetchUrl })
    const { refetch: pointsRefresh } = usePoints()

    const [matchesOrdered, setMatchesOrdered] = useState<MatchesOrdered>(getMatchesOrdered(initialData))
    useEffect(() => {
        if (matches) setMatchesOrdered(getMatchesOrdered(matches))
    }, [matches])

    const closestDayBox = useRef<HTMLDivElement>(null)
    useEffect(() => closestDayBox.current?.scrollIntoView({ behavior: "smooth", }), [])

    const today = dayjs()
    const closestIndex = useMemo<number>(() => getClosestDay(matchesOrdered, today.toDate()), [today, matchesOrdered])

    if (matchesOrdered.length === 0) {
        return <div className={twMerge("text-center p-14", className)}>
            Pas de Matchs
        </div>
    }

    return <div className={twMerge(
        "p-14 flex flex-col gap-2",
        className
    )} >
        {matchesOrdered.map((matchOrdered, index) => {
            const isToday = dayjs(matchOrdered.date).isSame(today, 'day')
            const hasPassedMatches = closestIndex > 0
            const isClosest = index === closestIndex && hasPassedMatches
            return <div key={index} className={`w-full ${mode !== 'homepage' && isToday ? "bg-custom-yellow-100 bg-opacity-10 p-2 rounded-lg" : ""} `} ref={isClosest ? closestDayBox : undefined}>
                {mode !== 'homepage' && <span className={twMerge(
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
                </span>}

                <div className="flex flex-col gap-2">
                    {matchOrdered.matches.map((match, index) => {
                        if (mode === "team") {
                            const isFinished = match.status === "finished"
                            const isWinner = match.winner_id && match.winner_id === props.team_id
                            return <MatchComponent onBet={() => {
                                pointsRefresh()
                                refetch()
                            }} match={match} key={index} className={twMerge(
                                "rounded-md",
                                isFinished ? isWinner ? "bg-custom-blue-300 border-l-[6px] border-l-custom-blue-400" : "bg-custom-red-300 border-l-[6px] border-l-custom-red-400" : ""
                            )} />
                        } else if (mode === "league" || mode === "homepage") {
                            return <MatchComponent onBet={() => {
                                pointsRefresh()
                                refetch()
                            }} match={match} key={index} />
                        }
                    })}
                </div>
            </div>
        })}
        {mode !== 'homepage' && <div className="min-h-[calc(100vh-112px)]"></div>}
    </div>
}