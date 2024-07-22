import type { ApiMatch } from "@/types/api"

const BASE_URL = "https://api.pandascore.co/lol"

export const idsTracked = {
	leagues: {
		MSI: 300,
		LEC: 4197,
		LFL: 4292
	}
} as const

export async function fetchMatches(): Promise<ApiMatch[]> {
	const url = `${BASE_URL}/matches?filter[league_id]=${idsTracked.leagues.LEC},${idsTracked.leagues.LFL}&per_page=100`
	const response = await fetch(url, {
		headers: {
			Authorization: process.env.PANDASCORE_API_KEY!,
			accept: "application/json"
		},
		cache: "no-cache"
	})
	return response.json()
}
