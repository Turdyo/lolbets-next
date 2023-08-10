import { getMatchesOrdered } from "@/lib/utils"
import { db } from "@/prisma"
import Image from "next/image"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { getTeamWinrates } from "@/lib/league"
import { TeamWinrate } from "@/components/TeamWinrate"
import { TeamMatchHisto } from "@/components/TeamMatchHisto"

dayjs.locale('fr')

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
        <div className="flex justify-between h-full overflow-scroll">
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 h-min items-center">
                    <Image src={team.image_url} width={70} height={70} alt={team.name} />
                    <h2 className="text-lg font-bold text-custom-yellow-100">{team.name}</h2>
                </div>
                <TeamWinrate data={teamWinrates} />
            </div>
            <TeamMatchHisto matchesOrdered={matchesOrdered} team_id={team.id} />
        </div>
    )
}