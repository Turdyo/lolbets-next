import { Status } from "@prisma/client";
import { Show } from "solid-js";
import { createServerAction$ } from "solid-start/server";
import { twMerge } from "tailwind-merge";
import { db } from "~/db/prisma";
import { PropsClass } from "~/lib/types";

type BetProps = {
  matchId: number
  team1Id: number
  team2Id: number
  status: Status
} & ({ hasBets: false } | { hasBets: true, team1BetsPercent: number, team2BetsPercent: number })

export function BetSection(props: BetProps) {

  if (props.status !== "not_started" && !props.hasBets) {
    return <div class="h-14 m-2 w-72"></div>
  }

  return <div class={twMerge(
    "flex justify-center gap-4 items-center h-14 m-2 w-72",
    (props.status === "finished" || props.status === "running") ? 'mt-0' : ""
  )}>
    <div class="w-36">
      <Show when={props.status === "not_started"}>
        <BetInput
          color="red"
          matchId={props.matchId}
          teamId={props.team1Id}
        />
      </Show>
      {props.hasBets && <div class="text-xl font-bold text-custom-red-400 flex flex-col items-end">
        {props.team1BetsPercent.toFixed()} %
        <div class="h-2 bg-custom-red-400 rounded-xl" style={`width: ${(120 * props.team1BetsPercent) / 100}px`}></div>
      </div>}
    </div>
    <div class="h-full w-px bg-gray-600 bg-opacity-60 mt-1"></div>
    <div class="w-36">
      <Show when={props.status === "not_started"}>
        <BetInput
          color="blue"
          matchId={props.matchId}
          teamId={props.team2Id}
        />
      </Show>
      {props.hasBets && <div class="text-xl font-bold text-custom-blue-400 rounded-xl">
        {props.team2BetsPercent.toFixed()} %
        <div class="h-2 bg-custom-blue-400 rounded-xl" style={`width: ${(120 * props.team2BetsPercent) / 100}px`}></div>
      </div>}
    </div>
  </div>
}

interface BetInputProps {
  color: "blue" | "red"
  matchId: number
  teamId: number
}

function BetInput(props: PropsClass<BetInputProps>) {
  const [betting, bet] = createServerAction$(
    ({ value, matchId, teamId }: { value: number, matchId: number, teamId: number }) => db.bet.create({
      data: {
        amount: value,
        matchId: matchId,
        teamId: teamId,
        userId: "227443388981444620"
      }
    })
  )
  return <div class={twMerge("flex h-8 rounded-md", props.class)}>
    <input
      class={twMerge(
        "rounded-l-md p-2 w-20 text-base outline-none bg-transparent border border-r-0 border-opacity-60 text-custom-white-200",
        props.color === "red" ? "border-custom-red-400" : "border-custom-blue-400"
      )} />
    <button
      class={twMerge(
        "h-full flex items-center text-sm bg-opacity-50 border transition-all text-center whitespace-nowrap w-min cursor-pointer select-none p-2 rounded-md rounded-l-none font-semibold border-opacity-60 hover:border-opacity-100",
        props.color === "red" ? "text-custom-red-400 border-custom-red-400 bg-custom-red-300 " : "text-custom-blue-400 border-custom-blue-400 bg-custom-blue-300"
      )}
      onClick={() => bet({
        value: 123,
        matchId: props.matchId,
        teamId: props.teamId
      })}
      disabled={betting.pending}
    >
      Bet
    </button>
  </div>
}