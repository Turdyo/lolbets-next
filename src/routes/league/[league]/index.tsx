import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Matches } from "~/components/Matches";
import { db } from "~/db/prisma";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(([league]) => db.match.findMany({
    where: {
      league: {
        name: {
          equals: decodeURI(league),
          mode: "insensitive"
        }
      }
    },
    include: {
      opponents: true,
      bets: true,
      games: true
    },
    orderBy: {
      scheduled_at: "asc"
    },
  }), { key: () => [params.league] })
}

export default function Page() {
  const matches = useRouteData<typeof routeData>()
  return <div class=" w-full h-full overflow-auto">
      <Matches matches={matches()} mode="league" class="h-full w-full max-w-5xl m-auto" />
  </div>
}