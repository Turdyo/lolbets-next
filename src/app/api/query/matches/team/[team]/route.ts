import { getMatchesByTeam } from "@/lib/query"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { team: string } }) {
    return NextResponse.json((await getMatchesByTeam(params.team))?.match)
}