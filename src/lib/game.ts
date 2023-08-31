import { db } from "~/db/prisma";
import { GameResponse } from "./apiConnector";

export async function createOrUpdateGames(games: GameResponse[]) {
    return await db.$transaction(
        games.map(game => db.game.upsert({
            where: {
                id: game.id
            },
            create: {
                id: game.id,
                begin_at: game.begin_at,
                complete: game.complete,
                end_at: game.end_at,
                finished: game.finished,
                length: game.length,
                position: game.position,
                status: game.status,
                winner_id: game.winner.id,
                match_id: game.match_id
            },
            update: {
                id: game.id,
                begin_at: game.begin_at,
                complete: game.complete,
                end_at: game.end_at,
                finished: game.finished,
                length: game.length,
                position: game.position,
                status: game.status,
                winner_id: game.winner.id
            }
        }))
    )
}