import { getLeaderboardUsers } from "@/lib/query";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET() {
    return NextResponse.json(await getLeaderboardUsers())
}