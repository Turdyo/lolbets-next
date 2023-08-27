import { Matches } from "@/components/Matches"
import { getMatchesByLeague } from "@/lib/query"

export const dynamic = 'force-dynamic'

export default async function League({ params }: { params: { league: string } }) {
    const league = await getMatchesByLeague(params.league)

    if (!league) {
        return <div>
            League {params.league} not found !
        </div>
    }

    return <Matches initialData={league.match} fetchUrl={`/api/query/matches/league/${params.league}`} mode="league" className="h-full w-full max-w-5xl m-auto" />

}