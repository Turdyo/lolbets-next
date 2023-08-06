import { ClickableSection } from "@/components/ui/ClickableSection"
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
    <div className="flex flex-wrap gap-6 m-20">
      {response.map((match, index) => <>
        <ClickableSection key={index} href="/" className="w-min whitespace-nowrap">
          {match.name}
        </ClickableSection>
      </>)}
    </div>
  )
}
