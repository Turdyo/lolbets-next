import { Match } from "@/components/Match"
import { db } from "@/prisma"

export default async function Home() {
  const match = await db.match.findFirst({
    where: {
      status: {
        notIn: ["canceled", "finished", "running"]
      }
    },
    include: {
      opponents: true,
      games: true
    }
  })

  return <div className="p-20 flex flex-col gap-4">
    <span className="text-4xl text-custom-yellow font-bold">Match of the day</span>
    <Match match={match!}/>
  </div>

}
