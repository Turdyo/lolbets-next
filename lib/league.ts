import { LeagueResponse } from "@/lib/apiConnector";
import { db } from "@/prisma";
import { Match, Team } from "@prisma/client";

export async function createOrUpdateLeagues(leagues: LeagueResponse[]) {
    return await db.$transaction(
        leagues.map(league => db.league.upsert({
            where: {
                id: league.id
            },
            create: {
                id: league.id,
                name: league.name,
                slug: league.slug,
                image_url: league.image_url
            },
            update: {
                id: league.id,
                name: league.name,
                slug: league.slug,
                image_url: league.image_url
            }
        }))
    )
}

export enum LeaguesTracked {
    LFL = "LFL",
    LEC = "LEC",
    LCK = "LCK",
    LPL = "LPL"
}

export async function getTeamWinrates(team_id: number) {
    const matches = await db.match.findMany({
        where: {
            opponents: {
                some: {
                    id: team_id
                }
            }
        },
        include: {
            opponents: true,
            games: true
        }
    })

    const opponents = matches.filter(match => match.status === "finished").map(match => match.opponents.filter(team => team.id !== team_id).at(0))
    const uniqueOpponents = opponents.reduce((unique: Team[], opponent) => opponent ? unique.includes(opponent) ? unique : [...unique, opponent] : unique, [])
    return uniqueOpponents
        .map(opponent => ({
            opponent: opponent,
            matches: matches.filter(match => match.opponents.filter(team => team.name === opponent.name).length === 1 && match.status === "finished")
        }))
        .sort((a, b) => a.matches.length - b.matches.length)

}
