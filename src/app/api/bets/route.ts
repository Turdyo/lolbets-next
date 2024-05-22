import { distributeBets } from "@/lib/actions/bet"
import { NextResponse } from "next/server"

export async function GET() {
	console.log("distributing bets")
	// const session = await auth()
	// if (!session) {
	// 	return NextResponse.json({ error: "Must be logged in" })
	// }
	await distributeBets()
	return NextResponse.json({ response: "done" })
}
