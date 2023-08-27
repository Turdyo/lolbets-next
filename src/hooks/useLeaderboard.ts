import { GetLeaderboardUsers } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";

export function useLeaderboard() {
    return useQuery({
        queryKey: ["leaderboard"],
        queryFn: async () => {
            const response = await fetch('/api/query/leaderboard', { cache: "no-store" })
            const json = await response.json()
            return json as GetLeaderboardUsers
        }
    })
}