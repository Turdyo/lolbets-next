import { Match } from "@prisma/client"
import dayjs from "dayjs"
import { MatchesOrdered } from "./types/common"

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

export function getClosestDay(matchesOrdered: MatchesOrdered, day: Date) {

    const futureMatches = matchesOrdered.filter(matchOrdered => dayjs(matchOrdered.date).isAfter(day))

    if (futureMatches.length === 0) {
        return -1
    }

    const closestDate = futureMatches.reduce((closest, match) => {
        const testDiff = Math.abs(dayjs(day).diff(match.date, 'day'))
        const closestDiff = Math.abs(dayjs(day).diff(closest.date, 'day'))
        return testDiff < closestDiff ? match : closest
    })

    return matchesOrdered.indexOf(closestDate)
}