import { getMatchesByLeague } from "@/lib/query"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest, { params }: { params: { league: string } }) {
    const path = request.nextUrl.searchParams.get('path') ?? "/"
    revalidatePath(path)    
    return NextResponse.json((await getMatchesByLeague(params.league))?.match)
}