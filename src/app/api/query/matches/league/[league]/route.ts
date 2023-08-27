import { getMatchesByLeague } from "@/lib/query"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { league: string } }) {
    return NextResponse.json((await getMatchesByLeague(params.league))?.match)
}