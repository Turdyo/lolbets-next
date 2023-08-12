import { PropsWithClassName } from "@/lib/types/common";
import { Game, Match, Status, Team } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import tbdImage from "@/public/team-tbd.png"
import { LiveButton } from "./LiveButton";
import Link from "next/link";

interface MatchProps {
    match: Match & {
        games: Game[],
        opponents: Team[]
    },
}

export function MatchComponent({
    className,
    match
}: PropsWithClassName<MatchProps>) {

    const team1 = match.opponents.at(0)
    const team2 = match.opponents.at(1)
    const team1Score = match.games.filter(game => game.winner_id === team1?.id).length
    const team2Score = match.games.filter(game => game.winner_id === team2?.id).length
    const isFinished = match.status === Status.finished
    const isRunning = match.status === Status.running
    const hasBets = true

    return <div className={twMerge(
        "p-1 w-full flex justify-between items-center border border-gray-700 rounded-lg whitespace-nowrap shadow-lg h-24",
        className
    )}>
        <Link href={`/team/${team1?.name}`}>
            <Image alt={team1?.name ?? "TBD"} src={team1?.image_url ?? tbdImage} height={50} width={50} className={!isFinished || match.winner_id === team1?.id ? "" : "opacity-30"} />
        </Link>
        <div className="flex flex-col items-center justify-start h-full w-full">
            <span className="font-semibold text-custom-white-200 text-center flex flex-col">
                {/* <span>{team1?.name ?? "TBD"} vs {team2?.name ?? "TBD"} (BO{match.number_of_games})</span> */}
                <span>{match.name} (BO{match.number_of_games})</span>
                {
                    !isRunning && <span className="text-sm">{dayjs(match.scheduled_at).format("HH:mm")}</span>
                }
            </span>
            <div className="flex justify-between w-full">
                <div></div>
                {
                    isFinished && <div className="font-extrabold text-2xl text-custom-white-200">
                        <span className={match.winner_id === team1?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{team1Score}</span> - <span className={match.winner_id === team2?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{team2Score}</span>
                    </div>
                }
                {
                    isRunning && <LiveButton className="mt-2" />
                }
                <div></div>
            </div>
            {/* {
                hasBets && <div className="h-1 w-10 bg-red-600"></div>
            } */}
        </div>
        <Link href={`/team/${team2?.name}`}>
            <Image alt={team2?.name ?? "TBD"} src={team2?.image_url ?? tbdImage} height={50} width={50} className={!isFinished || match.winner_id === team2?.id ? "" : "opacity-30"} />
        </Link>
    </div>
}