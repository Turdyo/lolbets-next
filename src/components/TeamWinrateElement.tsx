import { PropsWithClassName } from "@/lib/types/common";
import { Team } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface TeamWinrateElementProps {
    opponent: Team
    winrate: number
    nbMatches: number
    avgLength: number
}

export function TeamWinrateElement({
    className,
    opponent,
    avgLength,
    nbMatches,
    winrate
}: PropsWithClassName<TeamWinrateElementProps>) {
    return <div
        className={twMerge(
            "flex justify-between gap-6 items-center text-custom-white-200 whitespace-nowrap",
            className
        )}>
        <Link href={`/team/${opponent.name}`} className="flex items-center gap-2 text-sm font-semibold text-custom-yellow-100">
            <Image alt={opponent.acronym} src={opponent.image_url} width={32} height={32} />
            {opponent.acronym}
        </Link>
        <div className="flex flex-col gap-px items-center">
            <span>
                <span className="font-semibold">{(avgLength / 60).toFixed(0)}</span> min
            </span>
            <span className="text-xs">
                average
            </span>
        </div>
        <div className="flex flex-col gap-px items-center">
            <span>
                <span className="font-semibold">{winrate.toFixed(0)}</span>%
            </span>
            <span className="text-xs">
                {nbMatches} match
            </span>
        </div>
    </div>
}