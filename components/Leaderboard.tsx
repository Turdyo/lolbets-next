import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { User, getServerSession } from "next-auth"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import logo from '@/public/lolbets-logo.png'
import { PropsWithClassName } from "@/lib/types/common"

interface LeaderboardProps {
    users: User[]
}

export async function Leaderboard({
    users,
    className
}: PropsWithClassName<LeaderboardProps>) {

    const session = await getServerSession(authOptions)
    return <div className={twMerge("p-2 h-full flex flex-col gap-2 overflow-auto", className)}>
        {users.map((user, index) => <div key={index} className={twMerge(
            "border w-full border-gray-700 rounded-lg flex items-center justify-between p-4",
            session?.user?.name === user.name ? "bg-custom-blue-200 border-gray-600" : ""
        )}>
            <div className="flex items-center gap-4">
                <span className="text-custom-white-200 font-semibold">{index + 1}</span>
                <Image src={user.image!} alt={user.name!} width={40} height={40} className="rounded-full" />
                <span className={twMerge(
                    "font-semibold text-custom-white-200",
                    session?.user?.name === user.name ? "font-bold text-custom-white-100" : ""
                    )}>{user.name}</span>
            </div>
            <div className="flex">
                <span className="font-bold text-custom-yellow-100">{user.points}</span>&nbsp;<span className="text-custom-white-200 font-semibold"></span>
                <Image src={logo} alt="Logo" width={24} />
            </div>
        </div>)}
    </div>
}