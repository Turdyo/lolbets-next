import { db } from "@/prisma";
import { MatchResponse } from "./apiConnector";

export async function createOrUpdateMatches(matches: MatchResponse[]) {
    return await db.$transaction(
        matches.map(match => db.match.upsert({
            where: {
                id: match.id
            },
            create: {
                id: match.id,
                begin_at: match.begin_at,
                end_at: match.end_at,
                name: match.name,
                slug: match.slug,
                number_of_games: match.number_of_games,
                scheduled_at: match.scheduled_at,
                status: match.status,
                league_id: match.league_id,
                winner_id: match.winner_id,
                opponents: {
                    connect: match.opponents.map(opponent => ({
                        id: opponent.opponent.id
                    }))
                }
            },
            update: {
                id: match.id,
                begin_at: match.begin_at,
                end_at: match.end_at,
                name: match.name,
                slug: match.slug,
                number_of_games: match.number_of_games,
                scheduled_at: match.scheduled_at,
                status: match.status,
                league_id: match.league_id,
                winner_id: match.winner_id,
                opponents: {
                    set: [],
                    connect: match.opponents.map(opponent => ({
                        id: opponent.opponent.id
                    }))
                },
            }
        }))
    )
}