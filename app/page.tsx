import { db } from "@/prisma"

export default async function Home() {
  const response = await db.match.findMany({
    include: {
      opponents: true,
      games: true,
      league: true
    }
  })
  // const response = "yes"

  console.log(response)


  return (
    <div>
      {/* {response} */}
      {response.map(match => <div>{match.opponents.at(0)?.name}</div>)}
    </div>
  )
}
