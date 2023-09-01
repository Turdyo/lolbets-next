import { AiOutlineTeam } from "solid-icons/ai"

interface MatchStatsProps {
    color?: string
    nbBets: number
    totalAmount: number
}

export function MatchStats(props: MatchStatsProps) {
    return <div class="w-16">
        <span class="flex gap-2"><AiOutlineTeam size={24} fill={props.color} />{props.nbBets}</span>
        <span class="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={props.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></svg>
            {props.totalAmount}
        </span>
    </div>
}