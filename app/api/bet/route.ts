import { db } from "@/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod"
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({error: "not authenticated"})
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
        return NextResponse.json({ error: "user not found" })
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
        return NextResponse.json({ error: "match does not exist" })
    }
    if (match.status !== "not_started") {
        return NextResponse.json({ error: "match has already started" })
    }
    const opponents = match.opponents.map(team => team.id)
    if (!opponents.includes(parsedBody.teamId)) {
        return NextResponse.json({ error: "teamId not in match opponents" })
    }
    if (user.points < parsedBody.amount) {
        return NextResponse.json({ error: "not enough points" })
    }

    const bet = await db.bet.create({
        data: {
            amount: parsedBody.amount,
            userId: user.id,
            matchId: parsedBody.matchId,
            teamId: parsedBody.teamId
        }
    })

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
