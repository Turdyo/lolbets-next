import { Matches } from "@/components/Matches"
import { getMatchesOrdered } from "@/lib/utils"
import { db } from "@/prisma"

export const dynamic = 'force-dynamic'

export default async function League({ params }: { params: { league: string } }) {
    const league = await db.league.findFirst({
        where: {
            name: {
                equals: decodeURI(params.league),
                mode: "insensitive"
            }
        },
        include: {
            match: {
                include: {
                    games: true,
                    opponents: true
                },
                orderBy: {
                    scheduled_at: "asc"
                }
            }
        }
    })

    if (!league) {
        return <div>
            League {params.league} not found !
        </div>
    }

    const matchesOrdered = getMatchesOrdered(league.match)
    return <Matches matchesOrdered={matchesOrdered} mode="league" className="h-full w-full max-w-5xl m-auto" />

}