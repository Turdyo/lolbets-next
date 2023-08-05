import { fetchMatches } from "./apiConnector";
import { db } from "@/prisma";

export async function fillDb() {
    const matches = await fetchMatches("upcoming")

    const teams = matches.flatMap(match => match.opponents)
    const games = matches.flatMap(match => match.games)

    return Promise.all(matches.map(async match => await db.match.upsert({
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
            opponents: {
                connectOrCreate: match.opponents.map(opponent => ({
                    where: {
                        id: opponent.opponent.id
                    },
                    create: {
                        id: opponent.opponent.id,
                        acronym: opponent.opponent.acronym,
                        image_url: opponent.opponent.image_url,
                        location: opponent.opponent.location,
                        name: opponent.opponent.name,
                        slug: opponent.opponent.slug
                    }
                }))
            },
            league: {
                connectOrCreate: {
                    where: {
                        id: match.league.id
                    },
                    create: {
                        id: match.league.id,
                        image_url: match.league.image_url,
                        name: match.league.name,
                        slug: match.league.slug
                    },
                }
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
            opponents: {
                connectOrCreate: match.opponents.map(opponent => ({
                    where: {
                        id: opponent.opponent.id
                    },
                    create: {
                        id: opponent.opponent.id,
                        acronym: opponent.opponent.acronym,
                        image_url: opponent.opponent.image_url,
                        location: opponent.opponent.location,
                        name: opponent.opponent.name,
                        slug: opponent.opponent.slug
                    }
                }))
            },
            league: {
                connectOrCreate: {
                    where: {
                        id: match.league.id
                    },
                    create: {
                        id: match.league.id,
                        image_url: match.league.image_url,
                        name: match.league.name,
                        slug: match.league.slug
                    },
                }
            },
            games: {
                connectOrCreate: match.games.map(game => ({
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
                    }
                }))
            }

        },
    })
    ))

}