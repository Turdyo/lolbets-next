import { useQuery } from "@tanstack/react-query";

export function usePoints() {
    return useQuery({
        queryKey: ["points"],
        queryFn: async () => {
            const response = await fetch('/api/query/iam', { cache: "no-store" })
            const json = await response.json()
            return json as { points: number }
        }
    })
}