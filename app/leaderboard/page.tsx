import { db } from "@/prisma"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { twMerge } from "tailwind-merge"

export default async function Leaderboard() {
    const users = await db.user.findMany({
        orderBy: {
            points: "desc"
        }
    })

    const session = await getServerSession(authOptions)

    return <div className="p-14 h-full flex flex-col gap-6 overflow-scroll">
        {users.map((user, index) => <div key={index} className={twMerge(
            "border w-full border-gray-700 rounded-lg shadow-md h-20 flex items-center justify-between p-6",
            session?.user?.name === user.name ? "bg-custom-blue-200 border-gray-600" : ""
        )}>
            <div className="flex items-center gap-4">
                <span className="text-custom-white-200 font-semibold">{index + 1}</span>
                <Image src={user.image!} alt={user.name!} width={40} height={40} className="rounded-full" />
                <span className={"font-bold"}>{user.name}</span>
            </div>
            <div>
                <span className="font-bold text-custom-yellow-100">{user.points}</span>&nbsp;<span className="text-custom-white-200 font-semibold">pts</span>
            </div>
        </div>)}
    </div>
}