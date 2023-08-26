import { db } from "@/prisma";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

const todayWithoutHour = new Date(dayjs().add(2, 'hours').toDate().toDateString()) // UTC + 2 :)

export async function getLeaderboardUsers() {
    return db.user.findMany({
        select: {
            name: true,
            image: true,
            points: true
        },
        orderBy: {
            points: "desc"
        }
    })
}

export type GetLeaderboardUsers = Awaited<ReturnType<typeof getLeaderboardUsers>>

export async function getMatches(options?: Prisma.MatchFindManyArgs) {
    return db.match.findMany({
        ...options,
        include: {
            opponents: true,
            games: true,
            bets: true
        },
        orderBy: {
            scheduled_at: "asc"
        }
    })
}

export type GetMatches = Awaited<ReturnType<typeof getMatches>>

export function getMatchesOptions(mode: "upcoming" | "ofTheDay"): Prisma.MatchFindManyArgs | undefined {
    if (mode === "ofTheDay") {
        return {
            where: {
                scheduled_at: {
                    gte: todayWithoutHour,
                    lt: dayjs(todayWithoutHour).add(1, 'day').toDate()
                }
            }
        }
    } else if (mode === "upcoming") {
        return {
            where: {
                scheduled_at: {
                    gte: dayjs(todayWithoutHour).add(1, 'day').toDate(),
                    lt: dayjs(todayWithoutHour).add(7, 'day').toDate()
                }
            }
        }
    }
}

export async function getMatchesByTeam(team: string) {
    return db.team.findFirst({
        where: {
            OR: [{
                acronym: {
                    equals: decodeURI(team),
                    mode: "insensitive"
                }

            },
            {
                name: {
                    equals: decodeURI(team),
                    mode: "insensitive"
                }
            }]
        },
        include: {
            match: {
                include: {
                    opponents: true,
                    games: true,
                    bets: true
                },
                orderBy: {
                    scheduled_at: "asc"
                }
            }
        }
    })
}

export async function getMatchesByLeague(league: string) {
    return db.league.findFirst({
        where: {
            name: {
                equals: decodeURI(league),
                mode: "insensitive"
            }
        },
        include: {
            match: {
                include: {
                    games: true,
                    opponents: true,
                    bets: true
                },
                orderBy: {
                    scheduled_at: "asc"
                }
            }
        }
    })
}