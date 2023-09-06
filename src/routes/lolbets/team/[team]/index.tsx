import { Show } from "solid-js"
import { RouteDataArgs, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import { Matches } from "~/components/Matches"
import { TeamWinrate } from "~/components/TeamWinrate"
import { db } from "~/db/prisma"
import { getTeamWinrates } from "~/lib/team"

export function routeData({ params }: RouteDataArgs) {
  const winrates = createServerData$(([, team]) => getTeamWinrates(decodeURI(team)), { key: () => ["winrates", params.team] })
  const team = createServerData$(([team]) => db.team.findFirst({
    where: {
      name: {
        equals: decodeURI(team),
        mode: "insensitive"
      }
    },
    select: {
      image_url: true,
      name: true,
      id: true,
      match: {
        include: {
          opponents: true,
          games: true,
          bets: true
        },
        orderBy: {
          scheduled_at: "asc"
        },
      }
    }
  }), { key: () => [params.team] })

  return { team, winrates }
}

export default function Page() {
  const { team, winrates } = useRouteData<typeof routeData>()
  const matches = () => team()?.match

  return (
    <Show when={team()} fallback={<div>No team found</div>} >
      <div class="flex gap-14 justify-between h-full">
        <div class="flex flex-col gap-4 h-min min-w-max whitespace-nowrap">
          <div class="flex gap-4 items-center">
            <img src={team()?.image_url} width={70} height={70} alt={team()?.name} />
            <h2 class="text-lg font-bold text-custom-yellow-100">{team()?.name}</h2>
          </div>
          <TeamWinrate data={winrates()} />
        </div>
        <Matches matches={matches()} mode="team" team_id={team()?.id!} class="w-full p-2 h-full overflow-auto" />
      </div>
    </Show>
  )
}