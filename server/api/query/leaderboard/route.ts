import { getLeaderboardUsers } from "@/lib/query";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    const path = request.nextUrl.searchParams.get('path') ?? "/"
    revalidatePath(path)    
    return NextResponse.json(await getLeaderboardUsers())
}