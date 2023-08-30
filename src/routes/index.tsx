import { refetchRouteData, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Leaderboard } from "~/components/Leaderboard";
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
  return { usersData }
}


export default function Home() {
  const { usersData } = useRouteData<typeof routeData>()
  return (
    <main class="h-full w-full flex p-4">
      <div class="w-full">

      <button onclick={event => {refetchRouteData(['leaderboard']); console.log("etst")}} class=" bg-red-500 p-4 rounded-lg">refresh</button>
      </div>
      <SectionWithTitle title="Leaderboard" class="min-w-max max-w-xs">
        <Leaderboard users={usersData()} class="p-4 pt-0" />
      </SectionWithTitle>
    </main>
  );
}
