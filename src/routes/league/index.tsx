import { For } from "solid-js"
import { A, refetchRouteData, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import { db } from "~/db/prisma"

export function routeData() {
  return createServerData$(() => db.league.findMany({
    select: {
      name: true,
      image_url: true,
      _count: {
        select: {
          match: {
            where: {
              status: "not_started"
            }
          }
        }
      }
    }
  }))
}

export default function Page() {
  const leagues = useRouteData<typeof routeData>()
  return <div class="flex m-20 gap-6 flex-wrap justify-center h-min">
    <For each={leagues()} fallback={<div>No league</div>}>
      {(league) => <A
        href={`/league/${league.name.toLowerCase()}`}
        class="py-1 px-6 flex items-center w-80 h-36 rounded-xl bg-custom-blue-200 border border-gray-600 border-opacity-60 hover:border-opacity-100 transition-all cursor-pointer text-custom-white-200"
      >
        <img alt="icon" src={league.image_url!} width={100} height={100} />
        <div class="pl-6 flex flex-col">
          <span class="font-bold text-2xl text-custom-yellow-100">{league.name}</span>
          <span class="whitespace-nowrap">{league._count.match} matchs à venir</span>
        </div>
      </A>}
    </For>
  </div>
}