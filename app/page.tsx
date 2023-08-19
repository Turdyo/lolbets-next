import { Leaderboard } from "@/components/Leaderboard"
import { Matches } from "@/components/Matches"
import { SectionWithTitle } from "@/components/ui/SectionWithTitle"
import { getMatchesOrdered } from "@/lib/utils"
import { db } from "@/prisma"
import dayjs from "dayjs"

export const dynamic = 'force-dynamic'

export default async function Home() {
    const todayWithoutHour = new Date(new Date().toDateString())

    const matchesOfTheDayQuery = db.match.findMany({
        where: {
            scheduled_at: {
                gte: dayjs(todayWithoutHour).add(2, 'hours').toDate(),
                lt: dayjs(todayWithoutHour).add(2, 'hours').add(1, 'day').toDate()
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

    const upcomingMatchesQuery = db.match.findMany({
        where: {
            scheduled_at: {
                gte: dayjs(todayWithoutHour).add(2, 'hours').add(1, 'day').toDate(),
                lt: dayjs(todayWithoutHour).add(2, 'hours').add(7, 'day').toDate()
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

    const leaderboardQuery = db.user.findMany({
        orderBy: {
            points: "desc"
        }
    })

    const [matchesOfTheDay, upcomingMatches, users] = await Promise.all([matchesOfTheDayQuery, upcomingMatchesQuery, leaderboardQuery])


    const matchesOfTheDayOrdered = getMatchesOrdered(matchesOfTheDay)
    const upcomingMatchesOrdered = getMatchesOrdered(upcomingMatches)

    return <div className="flex h-full p-6 gap-6">
        <div className="basis-3/4 flex flex-col gap-6 h-full">
            <div className="h-[calc(50%-24px)]">
                <SectionWithTitle title="Matches of the day">
                    <Matches matchesOrdered={matchesOfTheDayOrdered} mode="homepage" className="p-2" />
                </SectionWithTitle>
            </div>
            <div className="flex gap-6 h-1/2">
                <SectionWithTitle title="Stats" className="basis-1/2"></SectionWithTitle>
                <SectionWithTitle title="Upcoming matches" className="basis-1/2">
                    <Matches matchesOrdered={upcomingMatchesOrdered} mode="league" className="p-2" />
                </SectionWithTitle>
            </div>
        </div>
        <SectionWithTitle title="Leaderboard" className="basis-1/4">
            <Leaderboard users={users} />
        </SectionWithTitle>
    </div>
}
