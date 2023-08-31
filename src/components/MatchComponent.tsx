import { Bet, Game, Match, Status, Team } from "@prisma/client"
import dayjs from "dayjs"
import { A } from "solid-start"
import { twMerge } from "tailwind-merge"
import { PropsClass } from "~/lib/types"
import { MatchStats } from "./MatchStats"
import { BetSection } from "./BetSection"
import { Show } from "solid-js"

type MatchProps = {
    match: Match & {
        games: Game[],
        opponents: Team[],
        bets: Bet[]
    }
}

export function MatchComponent(props: PropsClass<MatchProps>) {
    const match = props.match
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

    return <div class={twMerge(
        "p-2 px-4 w-full flex justify-between items-center border border-gray-700 rounded-lg whitespace-nowrap h-[134px] bg-custom-blue-200 relative",
        isRunning ? "border-custom-purple-text bg-custom-purple-text border-opacity-30 bg-opacity-10" : "",
        props.class
    )}>
        <Show when={isRunning}>
            <span class="absolute flex h-3 w-3 top-0 right-0 -mt-[5px] -mr-[5px]">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-custom-purple-text opacity-75 z-10"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-custom-purple-text z-10"></span>
            </span>
            <div class=" absolute top-0 right-0 p-2 font-semibold border-custom-purple-text text-custom-purple-text cursor-pointer underline" onClick={() => {
                window.open(stream_url, "_blank")
            }}>Live{` - ${stream_url.split('/').at(-1)}`}</div>
        </Show>
        <A href={`/team/${team1?.name}`}>
            <img alt={team1?.name ?? "TBD"} src={team1?.image_url ?? "/team-tbd.png"} height={60} width={60} class={!isFinished || match.winner_id === team1?.id ? "" : "opacity-30"} />
        </A>
        <div class="flex flex-col items-center justify-start h-full w-full">
            <span class="font-semibold text-custom-white-200 text-center flex flex-col">
                <span>{match.name} (BO{match.number_of_games})</span>
                <Show when={isNotStarted}>
                    <span class="text-sm">{dayjs(match.scheduled_at).format("HH:mm")}</span>
                </Show>
            </span>
            {areTeamsDefined && <div class="flex gap-6 text-custom-white-200 justify-center">
                <MatchStats color="#e84057" nbBets={team1Bets.length} totalAmount={team1BetsAmount} />
                <div>
                    {
                        (isRunning || isFinished) && <div class="font-extrabold text-2xl text-custom-white-200 flex flex-col items-center justify-center">
                            <div class="flex gap-2 items-center h-8">
                                <span class={match.winner_id === team1?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{team1Score}</span> - <span class={match.winner_id === team2?.id ? "text-custom-yellow-100" : "text-custom-white-200"}>{team2Score}</span>
                            </div>
                        </div>
                    }
                    <BetSection />
                    {/* matchId={match.id} team1Id={team1.id} team2Id={team2.id} status={match.status} hasBets={hasBets} team1BetsPercent={team1BetsPercent} team2BetsPercent={team2BetsPercent} /> */}
                </div>
                <MatchStats color="#5383e8" nbBets={team2Bets.length} totalAmount={team2BetsAmount} />
            </div>}
        </div>
        <A href={`/team/${team2?.name}`}>
            <img alt={team2?.name ?? "TBD"} src={team2?.image_url ?? "/team-tbd.png"} height={60} width={60} class={!isFinished || match.winner_id === team2?.id ? "" : "opacity-30"} />
        </A>

    </div>
}