import { PropsWithClassName } from "@/lib/types/common";
import { Bet, Game, Match, Status, Team } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import tbdImage from "@/public/team-tbd.png"
import { LiveButton } from "./LiveButton";
import Link from "next/link";
import { BetSection } from "./BetSection";
import { MatchStats } from "./MatchStats";

interface MatchProps {
    match: Match & {
        games: Game[],
        opponents: Team[],
        bets: Bet[]
    },
}

export function MatchComponent({
    className,
    match
}: PropsWithClassName<MatchProps>) {

    const team1 = match.opponents.at(0)
    const team2 = match.opponents.at(1)
    const areTeamsDefined = team1 && team2
    const team1Score = match.games.filter(game => game.winner_id === team1?.id).length
    const team2Score = match.games.filter(game => game.winner_id === team2?.id).length
    const isFinished = match.status === Status.finished
    const isRunning = match.status === Status.running
    const isNotStarted = match.status === Status.not_started
    const hasBets = match.bets.length !== 0
    const team1Bets = match.bets.filter(bet => bet.teamId === team1?.id)
    const team2Bets = match.bets.filter(bet => bet.teamId === team2?.id)
    const team1BetsAmount = team1Bets.reduce((prev, current) => prev + current.amount, 0)
    const team2BetsAmount = team2Bets.reduce((prev, current) => prev + current.amount, 0)
    const totalBets = team1BetsAmount + team2BetsAmount
    const team1BetsPercent = hasBets ? (team1BetsAmount / totalBets) * 100 : 0
    const team2BetsPercent = hasBets ? (team2BetsAmount / totalBets) * 100 : 0
    const stream_url = match.stream ?? "https://twitch.tv/otplol_"

    return <div className={twMerge(
        "p-2 px-4 w-full flex justify-between items-center border border-gray-700 rounded-lg whitespace-nowrap h-[134px] bg-custom-blue-200 relative",
        isRunning ? "border-custom-purple-text bg-custom-purple-text border-opacity-30 bg-opacity-10" : "",
        className
    )}>
        {
            isRunning && <>
                <span className="absolute flex h-3 w-3 top-0 right-0 -mt-[5px] -mr-[5px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-custom-purple-text opacity-75 z-10"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-custom-purple-text z-10"></span>
                </span>
                <div className=" absolute top-0 right-0 p-2 font-semibold border-custom-purple-text text-custom-purple-text cursor-pointer underline" onClick={() => {
                    window.open(stream_url, "_blank")
                }}>Live{` - ${stream_url.split('/').at(-1)}`}</div>
            </>
        }
        <Link href={`/team/${team1?.name}`}>
            <Image alt={team1?.name ?? "TBD"} src={team1?.image_url ?? tbdImage} height={60} width={60} className={!isFinished || match.winner_id === team1?.id ? "" : "opacity-30"} />
        </Link>
        <div className="flex flex-col items-center justify-start h-full w-full">
            <span className="font-semibold text-custom-white-200 text-center flex flex-col">
                <span>{match.name} (BO{match.number_of_games})</span>
                {isNotStarted && <span className="text-sm">{dayjs(match.scheduled_at).format("HH:mm")}</span>}
            </span>
            {areTeamsDefined && <div className="flex gap-6 text-custom-white-200 justify-center">
                <MatchStats color="#e84057" nbBets={team1Bets.length} totalAmount={team1BetsAmount} />
                <div>
                    {
                        (isRunning || isFinished) && <div className="font-extrabold text-2xl text-custom-white-200 flex flex-col items-center justify-center">
                            <div className="flex gap-2 items-center h-8">
                                <span className={match.winner_id === team1?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{team1Score}</span> - <span className={match.winner_id === team2?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{team2Score}</span>
                                {/* {isRunning && <LiveButton className="text-sm absolute top-0 right-0" stream_url={match.stream ?? undefined} />} */}
                            </div>
                        </div>
                    }
                    <BetSection matchId={match.id} team1Id={team1.id} team2Id={team2.id} status={match.status} hasBets={hasBets} team1BetsPercent={team1BetsPercent} team2BetsPercent={team2BetsPercent} />
                </div>
                <MatchStats color="#5383e8" nbBets={team2Bets.length} totalAmount={team2BetsAmount} />
            </div>}
        </div>
        <Link href={`/team/${team2?.name}`}>
            <Image alt={team2?.name ?? "TBD"} src={team2?.image_url ?? tbdImage} height={60} width={60} className={!isFinished || match.winner_id === team2?.id ? "" : "opacity-30"} />
        </Link>

    </div>
}