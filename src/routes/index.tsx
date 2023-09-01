import dayjs from "dayjs";
import { Show } from "solid-js";
import { refetchRouteData, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Leaderboard } from "~/components/Leaderboard";
import { Matches } from "~/components/Matches";
import { SectionWithTitle } from "~/components/ui/SectionWithTitle";
import { db } from "~/db/prisma";

export function routeData() {
  const usersData = createServerData$(() => db.user.findMany({
    select: {
      name: true,
      image: true,
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
  return { usersData, matchesOfTheDay, upcomingMatches }
}


export default function Home() {
  const { usersData, matchesOfTheDay, upcomingMatches } = useRouteData<typeof routeData>()
  return <main class="flex h-full w-full p-6 gap-6">
    <div class="w-full flex flex-col gap-6 h-full">
      <div class="h-[calc(50%-24px)]">
        <SectionWithTitle title="Matches of the day">
          <Matches matches={matchesOfTheDay()} mode="homepage" class="p-4 pt-0" />
        </SectionWithTitle>
      </div>
      <div class="flex gap-6 h-1/2">
        <SectionWithTitle title={"BETS"} class="min-w-max max-w-xs">
          BETS
        </SectionWithTitle>
        <SectionWithTitle title="Upcoming matches" class="w-full">
          <Matches matches={upcomingMatches()} mode="league" class="p-4 pt-0" />
        </SectionWithTitle>
      </div>
    </div>
    <SectionWithTitle title="Leaderboard" class="min-w-max max-w-xs">
      <Leaderboard users={usersData()} class="p-4 pt-0" />
    </SectionWithTitle>
  </main>
}
