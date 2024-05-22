import { fetchMatches } from "@/lib/apiConnector"
import { createOrUpdateGames } from "@/lib/game"
import { createOrUpdateLeagues } from "@/lib/league"
import { createOrUpdateMatches } from "@/lib/match"
import { createOrUpdateTeams } from "@/lib/team"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
	console.log("updating matches")

	const matches = await fetchMatches()

	const leagues = matches.map((match) => match.league)
	const teams = matches.flatMap((match) => match.opponents)
	const games = matches.flatMap((match) => match.games)

	await Promise.all([createOrUpdateTeams(teams), createOrUpdateLeagues(leagues)])
	await createOrUpdateMatches(matches)
	await createOrUpdateGames(games)

	return NextResponse.json({ response: "done" })
}
