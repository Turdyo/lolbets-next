import { GetMatches } from "@/lib/query"
import { useQuery } from "@tanstack/react-query"

interface Props {
    url: string
}

export function useMatches(props?: Props) {
    return useQuery({
        queryKey: ["matches", props?.url],
        queryFn: async () => {
            const response = await fetch(props?.url ?? "", { cache: "no-store" })
            const json = await response.json()
            return json as GetMatches
        }
    })
}