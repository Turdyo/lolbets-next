import { Show, createSignal } from "solid-js";
import { createServerAction$, json } from "solid-start/server";
import toast from "solid-toast";
import { twMerge } from "tailwind-merge";
import { db } from "~/db/prisma";
import { auth } from "~/lib/lucia";
import { PropsClass, Status } from "~/lib/types";

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
  const [input, setInput] = createSignal<number>(0)
  const [betting, bet] = createServerAction$(async (props: { value: number, matchId: number, teamId: number }, { request }) => {
    const authRequest = auth.handleRequest(request)
    const session = await authRequest.validate()

    if (!session) {
      return undefined
    }

    const user = () => session.user

    const match = await db.match.findUnique({
      where: {
        id: props.matchId
      },
      select: {
        id: true,
        status: true,
        bets: true,
        opponents: {
          select: {
            id: true
          }
        }
      }
    })

    if (!match) {
      return json({ error: "Match does not exist" }, { status: 400, statusText: "Match does not exist" })
    }
    if (match.status !== "not_started") {
      return json({ error: "Match has already started" }, { status: 400, statusText: "Match has already started" })
    }
    const opponents = match.opponents.map(team => team.id)
    if (!opponents.includes(props.teamId)) {
      return json({ error: "TeamId not in match opponents" }, { status: 400, statusText: "TeamId not in match opponents" })
    }
    if (user().points! < props.value || props.value === 0) {
      return json({ error: "Not enough points or bet equals 0" }, { status: 400, statusText: "Not enough points or bet equals 0" })
    }
    const previousBet = match.bets.find(bet => bet.userId === user().discordId)
    if (previousBet) {
      if (previousBet.teamId !== props.teamId) {
        return json({ error: "You have bet on the other team already" }, { status: 400, statusText: "You have bet on the other team already" })
      }
      await db.bet.update({
        where: {
          id: previousBet.id
        },
        data: {
          amount: {
            increment: props.value
          }
        }
      })
    } else {
      await db.bet.create({
        data: {
          amount: props.value,
          userId: user().discordId,
          matchId: props.matchId,
          teamId: props.teamId
        }
      })
    }
    await db.user.update({
      where: {
        discordId: user().discordId
      },
      data: {
        points: {
          decrement: props.value
        }
      }
    })
  })
  return <div class={twMerge("flex h-8 rounded-md", props.class)}>
    <input
      class={twMerge(
        "rounded-l-md p-2 w-20 text-base outline-none bg-transparent border border-r-0 border-opacity-60 text-custom-white-200",
        props.color === "red" ? "border-custom-red-400" : "border-custom-blue-400"
      )}
      onInput={event => {
        const value = event.currentTarget.value
        if (value && !Number.isNaN(parseInt(value))) {
          setInput(parseInt(value))
        }
      }} />
    <button
      class={twMerge(
        "h-full flex items-center text-sm bg-opacity-50 border transition-all text-center whitespace-nowrap w-min cursor-pointer select-none p-2 rounded-md rounded-l-none font-semibold border-opacity-60 hover:border-opacity-100",
        props.color === "red" ? "text-custom-red-400 border-custom-red-400 bg-custom-red-300 " : "text-custom-blue-400 border-custom-blue-400 bg-custom-blue-300"
      )}
      onClick={() => bet({
        value: input(),
        matchId: props.matchId,
        teamId: props.teamId
      }).then(async (resp) => {
        if (resp?.ok === false) {
          const json = await resp.json()
          toast.error(json.error)
        } else {
          toast.success("Bet registered 🪙")
        }
      })}
      disabled={betting.pending}
    >
      Bet
    </button>
  </div>
}