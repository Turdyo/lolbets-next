import { fillDb } from "@/lib/league";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await fillDb()

    return NextResponse.json(data)
}