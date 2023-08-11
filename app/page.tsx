import { MatchComponent } from "@/components/MatchComponent"
import { Matches } from "@/components/Matches"
import { getMatchesOrdered } from "@/lib/utils"
import { db } from "@/prisma"
import dayjs from "dayjs"

export default async function Home() {
  const matches = await db.match.findMany({
    where: {
      scheduled_at: {
        gte: dayjs().toDate(),
        lte: dayjs().add(3, 'day').toDate()
      }
    },
    include: {
      opponents: true,
      games: true
    },
    orderBy: {
      scheduled_at: "asc"
    }
  })

  const matchesOrdered = getMatchesOrdered(matches)

  return <div className="p-14 flex flex-col gap-4 h-full overflow-auto">
    <span className="text-4xl text-custom-yellow-100 font-bold">Matches of the day</span>
    <Matches matchesOrdered={matchesOrdered} mode="league" className="overflow-visible"/>

    <div className="text-4xl text-custom-yellow-100 font-bold">HOMEPAGE IS WIP</div>
  </div>

}
