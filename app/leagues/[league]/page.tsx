import { Match } from "@/components/Match"
import { getMatchesOrdered } from "@/lib/utils"
import { db } from "@/prisma"
import dayjs from "dayjs"
import "dayjs/locale/fr"

dayjs.locale("fr")

export default async function League({ params }: { params: { league: string } }) {
    const league = await db.league.findFirst({
        where: {
            name: {
                equals: params.league,
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

    return <div className={`p-14 h-full flex flex-wrap gap-6 overflow-scroll`} >
        {matchesOrdered.map((matchOrdered, index) => (
            <div key={index} className="w-full">
                <span className="font-semibold text-custom-white-200">{dayjs(matchOrdered.date).format("dddd D MMMM")}</span>
                {matchOrdered.matches.map((match, index) => <Match match={match} key={index} className="mt-2" />)}
            </div>
        ))}
    </div>
}