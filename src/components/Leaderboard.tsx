"use client"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import logo from '@/../public/lolbets-logo.png'
import { PropsWithClassName } from "@/lib/types/common"
import { GetLeaderboardUsers } from "@/lib/query"
import { useSession } from "next-auth/react"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { useEffect, useState } from "react"

interface LeaderboardProps {
    initialData: GetLeaderboardUsers
}

export function Leaderboard({
    initialData,
    className
}: PropsWithClassName<LeaderboardProps>) {
    const session = useSession()
    const sessionData = session.status === "authenticated" ? session.data : undefined
    const { data } = useLeaderboard()

    const [users, setUsers] = useState<GetLeaderboardUsers>(initialData)
    useEffect(() => {
        if (data) setUsers(data)
    }, [data])

    return <div className={twMerge("p-2 h-full flex flex-col gap-2 overflow-auto", className)}>
        {users.map((user, index) => <div key={index} className={twMerge(
            "border w-full border-gray-700 rounded-lg flex items-center justify-between p-4",
            sessionData?.user?.name === user.name ? "bg-custom-blue-200 border-gray-600" : ""
        )}>
            <div className="flex items-center gap-4">
                <span className="text-custom-white-200 font-semibold">{index + 1}</span>
                <Image src={user.image!} alt={user.name!} width={40} height={40} className="rounded-full" />
                <span className={twMerge(
                    "font-semibold text-custom-white-200",
                    sessionData?.user?.name === user.name ? "font-bold text-custom-white-100" : ""
                )}>{user.name}</span>
            </div>
            <div className="flex">
                <span className="font-bold text-custom-yellow-100">{user.points}</span>&nbsp;<span className="text-custom-white-200 font-semibold"></span>
                <Image src={logo} alt="Logo" width={24} />
            </div>
        </div>)}
    </div>
}