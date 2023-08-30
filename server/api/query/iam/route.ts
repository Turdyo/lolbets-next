import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET() {
    const session = await getServerSession(authOptions)
    return NextResponse.json({ points: session?.points ?? 0 })
}