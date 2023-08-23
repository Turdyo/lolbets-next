import { Coins, Users } from "lucide-react";

interface MatchStatsProps {
    color?: string
    nbBets: number
    totalAmount: number
}

export function MatchStats({
    color,
    nbBets,
    totalAmount
}: MatchStatsProps) {
    return <div className="w-16">
    <span className="flex gap-2"><Users color={color} />{nbBets}</span>
    <span className="flex gap-2"><Coins color={color}/>{totalAmount}</span>
</div>
}