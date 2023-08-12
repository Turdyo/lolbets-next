import { getMatchesOrdered } from "@/lib/utils"
import { db } from "@/prisma"
import Image from "next/image"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { getTeamWinrates } from "@/lib/league"
import { TeamWinrate } from "@/components/TeamWinrate"
import { Matches } from "@/components/Matches"

dayjs.locale('fr')

export const dynamic = 'force-dynamic'

export default async function Team({ params }: { params: { team: string } }) {
    const team = await db.team.findFirst({
        where: {
            OR: [{
                acronym: {
                    equals: decodeURI(params.team),
                    mode: "insensitive"
                }

            },
            {
                name: {
                    equals: decodeURI(params.team),
                    mode: "insensitive"
                }
            }]
        },
        include: {
            match: {
                include: {
                    opponents: true,
                    games: true
                },
                orderBy: {
                    scheduled_at: "asc"
                }
            },
            bets: true
        }
    })

    if (!team) {
        return <div>
            Team {params.team} not found !
        </div>
    }

    const teamWinrates = await getTeamWinrates(team.id)
    const matchesOrdered = getMatchesOrdered(team.match)

    return (
        <div className="flex gap-14 justify-between h-full">
            <div className="flex flex-col gap-4 h-min min-w-max whitespace-nowrap">
                <div className="flex gap-4 items-center">
                    <Image src={team.image_url} width={70} height={70} alt={team.name} />
                    <h2 className="text-lg font-bold text-custom-yellow-100">{team.name}</h2>
                </div>
                <TeamWinrate data={teamWinrates} />
            </div>
            <Matches matchesOrdered={matchesOrdered} mode="team" team_id={team.id} className="w-full p-2 h-full overflow-auto" />
        </div>
    )
}