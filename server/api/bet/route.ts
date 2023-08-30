import { db } from "@/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "not authenticated" }, { status: 400, statusText: "not authenticated" })
    }

    const user = await db.user.findUnique({
        where: {
            id: session.discordId
        },
        select: {
            points: true,
            id: true
        }
    })

    if (!user) {
        return NextResponse.json({ error: "user not found" }, { status: 400, statusText: "user not found" })
    }

    const body = await request.json()

    const betSchema = z.object({
        amount: z.number().max(user.points, "Not enough points"),
        matchId: z.number(),
        teamId: z.number()
    })

    const parsedBody = betSchema.parse(body)
    const match = await db.match.findUnique({
        where: {
            id: parsedBody.matchId
        },
        select: {
            id: true,
            status: true,
            bets: true,
            opponents: {
                select: {
                    id: true
                }
            }
        }
    })

    if (!match) {
        return NextResponse.json({ error: "match does not exist" }, { status: 400, statusText: "match does not exist" })
    }
    if (match.status !== "not_started") {
        return NextResponse.json({ error: "match has already started" }, { status: 400, statusText: "match has already started" })
    }
    const opponents = match.opponents.map(team => team.id)
    if (!opponents.includes(parsedBody.teamId)) {
        return NextResponse.json({ error: "teamId not in match opponents" }, { status: 400, statusText: "teamId not in match opponents" })
    }
    if (user.points < parsedBody.amount || parsedBody.amount === 0) {
        return NextResponse.json({ error: "not enough points or bet equals 0" }, { status: 400, statusText: "not enough points or bet equals 0" })
    }
    const previousBet = match.bets.find(bet => bet.userId === user.id)
    if (previousBet) {
        if (previousBet.teamId !== parsedBody.teamId) {
            return NextResponse.json({ error: "you have bet on the other team already" }, { status: 400, statusText: "you have bet on the other team already" })
        }
        var bet = await db.bet.update({
            where: {
                id: previousBet.id
            },
            data: {
                amount: {
                    increment: parsedBody.amount
                }
            }
        })
    } else {
        var bet = await db.bet.create({
            data: {
                amount: parsedBody.amount,
                userId: user.id,
                matchId: parsedBody.matchId,
                teamId: parsedBody.teamId
            }
        })
    }



    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            points: {
                decrement: parsedBody.amount
            }
        }
    })

    return NextResponse.json({ bet: bet })
}
