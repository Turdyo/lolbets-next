import { fetchMatches } from "@/lib/apiConnector";
import { createOrUpdateGames } from "@/lib/game";
import { LeaguesTracked, createOrUpdateLeagues } from "@/lib/league";
import { createOrUpdateMatches } from "@/lib/match";
import { createOrUpdateTeams } from "@/lib/team";
import { NextResponse } from "next/server";

export async function GET() {

    const pastMatches = await fetchMatches("past")
    const runningMatches = await fetchMatches("running")
    const upcomingMatches = await fetchMatches("upcoming")

    const matches = [...pastMatches, ...upcomingMatches, ...runningMatches].filter(match => {
        return match.league.name in LeaguesTracked
    })

    const leagues = matches.map(match => match.league)
    const teams = matches.flatMap(match => match.opponents)
    const games = matches.flatMap(match => match.games)

    await Promise.all([
        createOrUpdateTeams(teams),
        createOrUpdateLeagues(leagues)
    ])

    await createOrUpdateMatches(matches)
    await createOrUpdateGames(games)

    return NextResponse.json({ response: "done" })
}