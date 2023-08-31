import { Team } from "@prisma/client";
import { db } from "~/db/prisma";

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