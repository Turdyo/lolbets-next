import { Team } from "@prisma/client";
import { db } from "~/db/prisma";
import { LeagueResponse, OpponentResponse } from "./apiConnector";




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

export async function getTeamWinrates(team_name: string) {
  const matches = await db.match.findMany({
    where: {
      opponents: {
        some: {
          name: {
            equals: team_name,
            mode: "insensitive"
          }
        }
      },
      status: "finished"
    },
    include: {
      opponents: true,
      games: {
        where: {
          status: "finished"
        }
      }
    }
  })

  const opponents = matches.map(match => match.opponents.find(team => team.name.toLowerCase() !== team_name.toLowerCase()) as Team)
  const uniqueOpponents = opponents.reduce((unique: Team[], opponent) => unique.map(team => team.id).includes(opponent.id) ? unique : [...unique, opponent], [])

  return uniqueOpponents.map(opponent => ({
    opponent: opponent,
    matches: matches.filter(match => match.opponents.filter(team => team.name === opponent.name).length === 1)
  })).sort((a, b) => a.matches.length - b.matches.length).reverse()
}