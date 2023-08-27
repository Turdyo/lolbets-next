import Image from "next/image"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { getTeamWinrates } from "@/lib/league"
import { TeamWinrate } from "@/components/TeamWinrate"
import { Matches } from "@/components/Matches"
import { getMatchesByTeam } from "@/lib/query"

dayjs.locale('fr')

export const dynamic = 'force-dynamic'

export default async function Team({ params }: { params: { team: string } }) {
    const team = await getMatchesByTeam(params.team)
    if (!team) {
        return <div>
            Team {params.team} not found !
        </div>
    }

    const teamWinrates = await getTeamWinrates(team.id)

    return (
        <div className="flex gap-14 justify-between h-full">
            <div className="flex flex-col gap-4 h-min min-w-max whitespace-nowrap">
                <div className="flex gap-4 items-center">
                    <Image src={team.image_url} width={70} height={70} alt={team.name} />
                    <h2 className="text-lg font-bold text-custom-yellow-100">{team.name}</h2>
                </div>
                <TeamWinrate data={teamWinrates} />
            </div>
            <Matches initialData={team.match} fetchUrl={`/api/query/matches/team/${team.name}`} mode="team" team_id={team.id} className="w-full p-2 h-full overflow-auto" />
        </div>
    )
}