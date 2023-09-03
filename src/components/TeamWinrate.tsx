import { Game, Match, Team } from "@prisma/client"
import { For } from "solid-js"
import { A } from "solid-start"

interface TeamWinrateProps {
  data: {
    opponent: Team
    matches: (Match & {
      games: Game[]
    })[]
  }[] | undefined
}

export function TeamWinrate(props: TeamWinrateProps) {
  return <div class={"bg-custom-blue-200 border border-gray-700 border-opacity-60 p-2 rounded-lg flex flex-col gap-2"}>
    <For each={props.data} fallback={<div>No Stats</div>}>
      {(line) => {
        const games = () => line.matches.flatMap(match => match.games)
        const avgLength = () => games().reduce((total, game) => total + game.length!, 0) / games().length
        const nbMatches = () => line.matches.length
        const winrate = () => line.matches.reduce((total, match) => match.winner_id !== line.opponent.id ? total + 1 : total, 0) / nbMatches()
        return <TeamWinrateElement opponent={line.opponent} avgLength={avgLength()} nbMatches={nbMatches()} winrate={winrate() * 100} />
      }}
    </For>
  </div>
}


interface TeamWinrateElementProps {
  opponent: Team
  winrate: number
  nbMatches: number
  avgLength: number
}

function TeamWinrateElement(props: TeamWinrateElementProps) {
  return <div class={"flex justify-between gap-6 items-center text-custom-white-200 whitespace-nowrap"}>
    <A href={`/lolbets/team/${props.opponent.name}`} class="flex items-center gap-2 text-sm font-semibold text-custom-yellow-100">
      <img alt={props.opponent.acronym} src={props.opponent.image_url} width={32} height={32} />
      {props.opponent.acronym}
    </A>
    <div class="flex flex-col gap-px items-center">
      <span>
        <span class="font-semibold">{(props.avgLength / 60).toFixed(0)}</span> min
      </span>
      <span class="text-xs">average</span>
    </div>
    <div class="flex flex-col gap-px items-center">
      <span>
        <span class="font-semibold">{props.winrate.toFixed(0)}</span>%
      </span>
      <span class="text-xs">
        {props.nbMatches} match
      </span>
    </div>
  </div>
}