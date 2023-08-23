import { Navbar } from "./Navbar";
import { Logo } from "./Logo";
import { LoginButton } from "./LoginButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/prisma";

export async function Sidebar() {
    const session = await getServerSession(authOptions)

    const user = await db.user.findUnique({
        where: {
            id: session?.discordId ?? "",
        },
        select: {
            name: true,
            points: true,
            image: true
        }
    }) 

    return <div className='bg-custom-blue-200 flex flex-col w-72 shrink-0 justify-between'>
        <div>
            <Logo />
            <Navbar />
        </div>
        <LoginButton user={user} />
    </div>
}