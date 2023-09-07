import { Bet, Game, Match, Team } from "@prisma/client"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"
import { getClosestDay, getMatchesOrdered } from "~/lib/utils"
import { FaSolidArrowUp } from 'solid-icons/fa'
import { MatchComponent } from "./MatchComponent"
import { PropsClass } from "~/lib/types"
import { For, Show, createEffect, createSignal, onCleanup } from "solid-js"
import { createViewportObserver } from "@solid-primitives/intersection-observer"

type MatchesProps = {
  matches: (Match & {
    opponents: Team[]
    bets: Bet[]
    games: Game[]
  })[] | undefined
} & ({ mode: 'team', team_id: number } | { mode: 'league' | 'homepage' })

export function Matches(props: PropsClass<MatchesProps>) {
  const today = () => dayjs()
  const matchesOrdered = () => getMatchesOrdered(props.matches)
  const closestIndex = () => getClosestDay(matchesOrdered(), today().toDate())
  const [closestDayBox, setClosestDayBox] = createSignal<HTMLDivElement | undefined>(undefined)
  let topBox: HTMLDivElement | undefined

  createEffect(() => {
    if (closestIndex() === -1) setClosestDayBox(undefined)
    if (!closestDayBox()) return
    closestDayBox()!.scrollIntoView({ behavior: "smooth" })
  })


  return <div class={twMerge("p-14 flex flex-col gap-2 relative", props.class)}>
    <div ref={topBox} />
    <For each={matchesOrdered()} fallback={<div>No matches</div>}>
      {(matchOrdered, index) => {
        const isToday = () => dayjs(matchOrdered.date).isSame(today(), 'day')
        const hasPassedMatches = () => closestIndex() > 0
        const isClosest = () => index() === closestIndex() && hasPassedMatches()
        return <div
          class={`w-full ${props.mode !== 'homepage' && isToday() ? "bg-custom-yellow-100 bg-opacity-10 p-2 rounded-lg" : ""} `}
          ref={(div) => {
            if (!isClosest()) return
            setClosestDayBox(div)
          }}
        >
          <Show when={props.mode !== 'homepage'}>
            <span class={twMerge(
              "font-semibold text-custom-white-200",
              isToday() ? "text-custom-yellow-200" : ""
            )}>
              <div class="flex justify-between">
                <Show when={!isToday()} fallback={"Aujourd'hui"}>
                  {dayjs(matchOrdered.date).format("dddd D MMMM")}
                </Show>
                <Show when={isClosest()}>
                  <div
                    class="flex gap-2 text-custom-yellow-100 items-center cursor-pointer"
                    onClick={() => topBox?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <FaSolidArrowUp
                      class="animate-bounce"
                      size={20}
                      fill="#e9ce8b"
                    />
                    Résultats passés
                  </div>
                </Show>
              </div>
            </span>
          </Show>
          <div class="flex flex-col gap-2">
            <For each={matchOrdered.matches}>
              {(match) => {
                if (props.mode === "team") {
                  const isFinished = () => match.status === "finished"
                  const isWinner = () => match.winner_id && match.winner_id === props.team_id
                  return <MatchComponent
                    match={match}
                    class={twMerge(
                      "rounded-md",
                      isFinished() ? isWinner() ? "bg-custom-blue-300 border-l-[6px] border-l-custom-blue-400" : "bg-custom-red-300 border-l-[6px] border-l-custom-red-400" : ""
                    )}
                  />
                } else if (props.mode === "league" || props.mode === "homepage") {
                  return <MatchComponent match={match} />
                }
              }}
            </For>
          </div>
        </div>
      }}
    </For>
    <Show when={props.mode !== 'homepage'}>
      <div class="min-h-[calc(100vh-112px)]" />
    </Show>
  </div>
}