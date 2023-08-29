import { Status } from "@prisma/client"
import "dotenv/config"

export interface MatchResponse {
    begin_at: string
    draw: boolean
    end_at: string | null
    forfeit: boolean
    game_advantage: null
    games: GameResponse[]
    id: number
    league: LeagueResponse
    league_id: number
    match_type: string
    modified_at: string | null
    name: string
    number_of_games: number
    opponents: OpponentResponse[]
    original_scheduled_at: string
    rescheduled: boolean
    results: {
        score: number
        team_id: number
    }[]
    scheduled_at: string
    slug: string
    status: Status
    streams_list: {
        embeded_url: string
        language: string
        main: boolean
        official: boolean
        raw_url: string
    }[]
    winner: TeamResponse
    winner_id: number
    winner_type: string
}

export interface OpponentResponse {
    opponent: TeamResponse
    type: string
}

export interface GameResponse {
    begin_at: string | null
    complete: boolean
    end_at: string | null
    finished: boolean
    forfeit: boolean
    id: number
    length: number | null
    match_id: number
    position: number
    status: Status
    winner: {
        id: number | null
        type: string
    }
    winner_type: string
}

export interface LeagueResponse {
    id: number
    image_url: string | null
    modified_at: string
    name: string
    slug: string
    url: string
}

interface TeamResponse {
    acronym: string | null
    id: number
    image_url: string
    location: string | null
    modified_at: string
    name: string
    slug: string
}

export async function fetchMatches(time: "past" | "upcoming" | "running"): Promise<MatchResponse[]> {
    return (await fetch(`https://api.pandascore.co/lol/matches/${time}?per_page=100`, {
        method: "GET",
        headers: {
            Authorization: process.env.PANDASCORE_API_KEY ?? ""
        },
        cache: 'no-store'
    })).json()
}