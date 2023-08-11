import { PropsWithClassName } from "@/lib/types/common";
import { Game, Match, Status, Team } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import tbdImage from "@/public/team-tbd.png"
import { Button } from "./ui/Button";

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

    return <div className={twMerge(
        "p-1 w-full flex justify-between items-center border border-gray-700 rounded-lg whitespace-nowrap shadow-lg h-24",
        className
    )}>
        <Image alt={team1?.name ?? "TBD"} src={team1?.image_url ?? tbdImage} height={50} width={50} className={!isFinished || match.winner_id === team1?.id ? "" : "opacity-30"} />
        <div className="flex flex-col items-center justify-start h-full w-full">
            <div className="font-semibold text-custom-white-200 text-center">
                {team1?.name ?? "TBD"} vs {team2?.name ?? "TBD"} (BO{match.number_of_games})<br />
                {!isRunning && dayjs(match.scheduled_at).format("HH:mm")}
            </div>
            <div className="flex justify-between w-full">
                <div></div>
                {
                    isFinished && <div className="font-extrabold text-2xl text-custom-white-200">
                        <span className={match.winner_id === team1?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{team1Score}</span> - <span className={match.winner_id === team2?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{team2Score}</span>
                    </div>
                }
                {
                    isRunning && <div className="relative w-max mt-1 mr-9">
                        <Button className="absolute p-2 z-0 border-custom-purple-text text-custom-purple-text">Live</Button>
                        <span className="relative flex h-3 w-3 -mt-1 -ml-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-custom-purple-text opacity-75 z-10"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-custom-purple-text z-10"></span>
                        </span>
                    </div>
                }
                <div></div>
            </div>
        </div>
        <Image alt={team2?.name ?? "TBD"} src={team2?.image_url ?? tbdImage} height={50} width={50} className={!isFinished || match.winner_id === team2?.id ? "" : "opacity-30"} />
    </div>
}