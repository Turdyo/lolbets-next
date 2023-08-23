import { Leaderboard } from "@/components/Leaderboard"
import { Matches } from "@/components/Matches"
import { SectionWithTitle } from "@/components/ui/SectionWithTitle"
import { getMatchesOrdered } from "@/lib/utils"
import { db } from "@/prisma"
import dayjs from "dayjs"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"

export const dynamic = 'force-dynamic'

export default async function Home() {
    const todayWithoutHour = new Date(dayjs().add(2, 'hours').toDate().toDateString()) // UTC + 2 :)
    const session = await getServerSession(authOptions)

    fetch("https://dev.lolbets.4esport.fr/api/filldb", {
        cache: "no-cache"
    })

    const matchesOfTheDayQuery = db.match.findMany({
        where: {
            scheduled_at: {
                gte: todayWithoutHour,
                lt: dayjs(todayWithoutHour).add(1, 'day').toDate()
            }
        },
        include: {
            opponents: true,
            games: true,
            bets: true
        },
        orderBy: {
            scheduled_at: "asc"
        }
    })

    const upcomingMatchesQuery = db.match.findMany({
        where: {
            scheduled_at: {
                gte: dayjs(todayWithoutHour).add(1, 'day').toDate(),
                lt: dayjs(todayWithoutHour).add(7, 'day').toDate()
            }
        },
        include: {
            opponents: true,
            games: true,
            bets: true
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

    const betsQuery = session ? db.bet.findMany({
        where: {
            userId: session.discordId
        },
        select: {
            amount: true,
            match: {
                select: {
                    name: true,
                    opponents: true
                }
            },
            team: {
                select: {
                    image_url: true,
                    name: true
                }
            }
        },
        orderBy: {
            match: {
                scheduled_at: "desc"
            }
        }
    }) : undefined

    const [matchesOfTheDay, upcomingMatches, users, bets] = await Promise.all([matchesOfTheDayQuery, upcomingMatchesQuery, leaderboardQuery, betsQuery])

    const matchesOfTheDayOrdered = getMatchesOrdered(matchesOfTheDay)
    const upcomingMatchesOrdered = getMatchesOrdered(upcomingMatches)

    return <div className="flex h-full p-6 gap-6">
        <div className="w-full flex flex-col gap-6 h-full">
            <div className="h-[calc(50%-24px)]">
                <SectionWithTitle title="Matches of the day">
                    <Matches matchesOrdered={matchesOfTheDayOrdered} mode="homepage" className="p-4 pt-0" />
                </SectionWithTitle>
            </div>
            <div className="flex gap-6 h-1/2">
                <SectionWithTitle title="Bets (WIP)" className="min-w-max max-w-xs">
                    <div className="p-4 pt-0 flex flex-col gap-2">
                        {bets && <div className="flex justify-between">
                            <span>Amount</span>
                            <span>Team</span>
                        </div>}
                        {bets?.map((bet, index) => <div key={index} className="border-gray-700 border rounded-lg p-2 flex justify-between">
                            <span className="text-custom-yellow-100 font-semibold">{bet.amount}</span>
                            <span>{bet.team.name}</span>
                        </div>)}
                    </div>
                </SectionWithTitle>
                <SectionWithTitle title="Upcoming matches" className="w-full">
                    <Matches matchesOrdered={upcomingMatchesOrdered} mode="league" className="p-4 pt-0" />
                </SectionWithTitle>
            </div>
        </div>
        <SectionWithTitle title="Leaderboard" className="min-w-max max-w-xs">
            <Leaderboard users={users} className="p-4 pt-0" />
        </SectionWithTitle>
    </div>
}
