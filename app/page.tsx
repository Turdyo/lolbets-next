import { db } from "@/prisma"

export default async function Home() {
  const response = await db.match.findMany({
    where: {
      league: {
        name: "LFL"
      }
    },
    include: {
      opponents: true,
      games: true,
      league: true
    }
  })

  return (
    <div className="flex flex-col gap-6 m-10">
      {response.map((match, index) => <>
        <div className="bg-[#1a2231] p-4 rounded-lg border border-gray-600 border-opacity-60 hover:border-opacity-100 transition-all cursor-pointer">
          {match.name}
        </div>
      </>)}
    </div>
  )
}
