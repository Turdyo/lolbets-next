import { getMatches, getMatchesOptions } from "@/lib/query";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET() {
    return NextResponse.json(await getMatches(getMatchesOptions("upcoming")))
}