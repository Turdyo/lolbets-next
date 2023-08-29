import { getMatches, getMatchesOptions } from "@/lib/query";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    const todayWithoutHour = new Date(dayjs().add(2, 'hours').toDate().toDateString()) // UTC + 2 :)
    const path = request.nextUrl.searchParams.get('path') ?? "/"
    revalidatePath(path)    
    return NextResponse.json(await getMatches(getMatchesOptions("upcoming", todayWithoutHour)))
}