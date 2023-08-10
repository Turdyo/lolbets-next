import { PropsWithClassName } from "@/lib/types/common";
import { Game, Match, Status, Team } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import tbdImage from "@/public/team-tbd.png"

interface MatchProps {
    match: Match & {
        games: Game[],
        opponents: Team[]
    },
}

export function Match({
    className,
    match
}: PropsWithClassName<MatchProps>) {

    const team1 = match.opponents.at(0)
    const team2 = match.opponents.at(1)
    const isFinished = match.status === Status.finished
    const isRunning = match.status === Status.running

    return <div className={twMerge(
        "p-2 w-full flex justify-between items-center border border-gray-700 rounded-lg whitespace-nowrap shadow-lg h-28",
        className
    )}>
        <Image alt={team1?.name ?? "TBD"} src={team1?.image_url ?? tbdImage} height={50} width={50} className={!isFinished || match.winner_id === team1?.id ? "" : "opacity-30"} />
        <div className="flex flex-col items-center justify-start h-full w-full">
            <div className="font-semibold text-custom-white-200 text-center">
                {team1?.name ?? "TBD"} vs {team2?.name ?? "TBD"} (BO{match.number_of_games})<br />
                {dayjs(match.scheduled_at).format("HH:mm")}
            </div>
            <div className="flex justify-between w-full">
                <div></div>
                {
                    isFinished && <div className="font-extrabold text-3xl text-custom-white-200">
                        <span className={match.winner_id === team1?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{match.games.filter(game => game.winner_id === team1?.id).length}</span> - <span className={match.winner_id === team2?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{match.games.filter(game => game.winner_id === team2?.id).length}</span>
                    </div>
                }
                <div></div>
            </div>
            {/* <div className="flex gap-2 font-semibold">
                <div className="text-[#e84057] flex flex-col">
                    <div className="bg-[#e84057] h-[6px] w-10"></div>
                    <span className="self-end">18%</span>

                </div>
                <div className="text-[#5383e8]">
                    <div className="bg-[#5383e8] h-[6px] w-10"></div>
                    <span>82%</span>
                </div>
            </div> */}
        </div>
        <Image alt={team2?.name ?? "TBD"} src={team2?.image_url ?? tbdImage} height={50} width={50} className={!isFinished || match.winner_id === team2?.id ? "" : "opacity-30"} />
    </div>
}