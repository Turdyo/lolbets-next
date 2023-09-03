import dayjs from "dayjs";
import { For} from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Leaderboard } from "~/components/Leaderboard";
import { Matches } from "~/components/Matches";
import { SectionWithTitle } from "~/components/ui/SectionWithTitle";
import { db } from "~/db/prisma";
import { useSession } from "~/lib/server";

export function routeData() {
  const usersData = createServerData$(() => db.user.findMany({
    select: {
      name: true,
      image_url: true,
      points: true
    },
    orderBy: {
      points: "desc"
    }
  }), { key: ['leaderboard'] })

  const matchesOfTheDay = createServerData$(() => {
    const dayWithoutHour = new Date(dayjs().add(2, 'hours').toDate().toDateString()) // UTC + 2 :)
    return db.match.findMany({
      where: {
        scheduled_at: {
          gte: dayWithoutHour,
          lt: dayjs(dayWithoutHour).add(1, 'day').toDate()
        }
      },
      include: {
        opponents: true,
        games: true,
        bets: true
      },
      orderBy: {
        scheduled_at: "asc"
      }
    })
  }, { key: ["matches", "ofTheDay"] })

  const upcomingMatches = createServerData$(() => {
    const dayWithoutHour = new Date(dayjs().add(2, 'hours').toDate().toDateString()) // UTC + 2 :)
    return db.match.findMany({
      where: {
        scheduled_at: {
          gte: dayjs(dayWithoutHour).add(1, 'day').toDate(),
          lt: dayjs(dayWithoutHour).add(7, 'day').toDate()
        }
      },
      include: {
        opponents: true,
        games: true,
        bets: true
      },
      orderBy: {
        scheduled_at: "asc"
      }
    })
  }, { key: ["matches", "upcoming"] })

  const user = useSession()

  const bets = createServerData$(([id]) => db.bet.findMany({
    where: {
      userId: id
    },
    include: {
      team: true
    }
  }), { key: () => [user()?.discordId] })

  return { usersData, matchesOfTheDay, upcomingMatches, bets }
}


export default function Home() {
  const { usersData, matchesOfTheDay, upcomingMatches, bets } = useRouteData<typeof routeData>()

  return <main class="flex h-full w-full p-6 gap-6">
    <div class="w-full flex flex-col gap-6 h-full">
      <div class="h-[calc(50%-24px)]">
        <SectionWithTitle title="Matches of the day">
          <Matches matches={matchesOfTheDay()} mode="homepage" class="p-4 pt-0" />
        </SectionWithTitle>
      </div>
      <div class="flex gap-6 h-1/2">
        <SectionWithTitle title={"Bets"} class="min-w-max max-w-xs">
        <div class="flex flex-col gap-2 p-4 max-h-[calc(100%-80px)] overflow-auto">
          <For each={bets()} fallback={<div>No bets</div>}>
            {(bet) => <div class="border-gray-700 border rounded-lg p-2 flex justify-between">
              <span class="text-custom-yellow-100 font-semibold">{bet.amount}</span>
              <span>{bet.team.name}</span>
            </div>}
          </For>
          </div>
{/* 
          <Show when={user()} fallback={<a href="/api/login/discord" class="border rounded-lg border-custom-purple-text p-3 text-custom-purple-text absolute bottom-4 left-[calc(50%-33px)]">Login</a>}>
            <div class="absolute top-4 right-4 flex gap-3 text-custom-white-200 font-semibold">
              <img src={user()?.image_url} class="rounded-full" width={48} height={48} />
              <div class="flex flex-col">
                <span>{user()?.name}</span>
                <div class="flex gap-2 items-center">
                  <span class="text-custom-yellow-100">{user()?.points}</span>
                  <img src="/lolbets-logo.png" width={24} />
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2 p-4 max-h-[calc(100%-80px)] overflow-auto">
              <For each={bets()} fallback={<div>No bets</div>}>
                {(bet) => <div class="border-gray-700 border rounded-lg p-2 flex justify-between">
                  <span class="text-custom-yellow-100 font-semibold">{bet.amount}</span>
                  <span>{bet.team.name}</span>
                </div>}
              </For>
            </div>
            <button onClick={() => logout()} class="border rounded-lg border-custom-purple-text p-3 text-custom-purple-text w-min absolute bottom-4 left-[calc(50%-33px)]">
              Logout
            </button>
          </Show> */}
        </SectionWithTitle>
        <SectionWithTitle title="Upcoming matches" class="w-full">
          <Matches matches={upcomingMatches()} mode="league" class="p-4 pt-0" />
        </SectionWithTitle>
      </div>
    </div >
    <SectionWithTitle title="Leaderboard" class="min-w-max max-w-xs">
      <Leaderboard users={usersData()} class="p-4 pt-0" />
    </SectionWithTitle>
  </main >
}
