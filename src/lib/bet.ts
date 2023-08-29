interface BetProps {
    amount: number
    teamId: number
    matchId: number
}

export function bet({
    amount,
    teamId,
    matchId
}: BetProps) {
    return fetch("/api/bet", {
        method: "POST",
        body: JSON.stringify({
            amount: amount,
            teamId: teamId,
            matchId: matchId
        }),
        cache: "no-store"
    })
}