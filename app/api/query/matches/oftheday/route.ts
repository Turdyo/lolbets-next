import { getMatches, getMatchesOptions } from "@/lib/query";
import { NextResponse } from "next/server";


export async function GET() {
    return NextResponse.json(await getMatches(getMatchesOptions("ofTheDay")))
}