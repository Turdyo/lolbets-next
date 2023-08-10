import { Game, Match, Team } from "@prisma/client"
import dayjs from "dayjs"

export function getNormalizedText(text: string) {
    return text.toLowerCase().replace(/ /g, "")
}

export function getMatchesOrdered<T>(matches: (Match & T)[]) {
    return matches
        .map(match => match.scheduled_at)
        .reduce((unique: Date[], day) => unique
            .map(dayTemp => dayjs(dayTemp).format("dddd D MMMM"))
            .includes(dayjs(day).format("dddd D MMMM")) ? unique : [...unique, day], [])
        .map(day => ({
            date: day,
            matches: matches.filter(match => dayjs(day).isSame(match.scheduled_at, "day"))
        }))
}