import { db } from "@/prisma";
import { OpponentResponse } from "./apiConnector";

export async function createOrUpdateTeams(teams: OpponentResponse[]) {
    return await db.$transaction(
        teams.map(team => db.team.upsert({
            where: {
                id: team.opponent.id
            },
            create: {
                id: team.opponent.id,
                acronym: team.opponent.acronym ?? "",
                image_url: team.opponent.image_url,
                name: team.opponent.name,
                slug: team.opponent.slug,
                location: team.opponent.location,
            },
            update: {
                id: team.opponent.id,
                acronym: team.opponent.acronym ?? "",
                image_url: team.opponent.image_url,
                name: team.opponent.name,
                slug: team.opponent.slug,
                location: team.opponent.location,
            }
        })),
    )
}