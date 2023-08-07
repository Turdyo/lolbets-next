import { Match } from "@/components/Match"
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
                // where: {
                //     status: {
                //         notIn: ["finished", "canceled"]
                //     }
                // },
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
        throw new Error(`No league named ${params.league}`)
    }

    const matchesOrdered = league.match.map(match => match.scheduled_at)
        .reduce((unique: Date[], day) => unique
            .map(dayTemp => dayjs(dayTemp).format("dddd D MMMM"))
            .includes(dayjs(day).format("dddd D MMMM")) ? unique : [...unique, day], [])
        .map(day => ({
            date: day,
            matches: league.match.filter(match => dayjs(day).isSame(match.scheduled_at, "day"))
        }))

    return <div className={`p-20 h-full flex flex-wrap gap-6 overflow-scroll`} >
        {matchesOrdered.map((matchOrdered, index) => <div key={index} className="w-full">
            <span className="font-semibold text-custom-white-200">{dayjs(matchOrdered.date).format("dddd D MMMM")}</span>
            {matchOrdered.matches.map((match, index) => <Match match={match} key={index} className="mt-4" />)}
        </div>)}

    </div>

}