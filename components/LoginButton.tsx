"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./ui/Button"
import Image from "next/image"
import logo from '@/public/lolbets-logo.png'
import { LogIn } from "lucide-react"

export function LoginButton() {
    const session = useSession()

    if (session.status === "authenticated") {
        return <div className="flex gap-2 p-2 bg-custom-blue-300">
            <Image src={session.data.user?.image!} width={48} height={48} className="rounded-full" alt={session.data.user?.name!} />
            <div className="flex justify-between w-full opacity-0 group-hover:opacity-100 transition-all">
                <div className="flex flex-col" >
                    <span className="font-bold text-custom-white-100">{session.data.user?.name!}</span>
                    <span className="flex gap-2">
                        <span className="font-bold text-custom-yellow-100">{session.data.points}</span>
                        <Image src={logo} alt="Logo" width={24} />
                    </span>
                </div>
                <Button onClick={() => signOut()} className="border-custom-purple-text text-custom-purple-text p-[10px]">Logout</Button>
            </div>
        </div>
    } else {
        return <div className="p-2 relative bg-custom-blue-300 flex items-center">
            <Button onClick={() => signIn("discord")} className="border-custom-purple-text text-custom-purple-text p-[10px] opacity-100 group-hover:opacity-0 transition-all absolute"><LogIn /></Button>
            <Button onClick={() => signIn("discord")} className="border-custom-purple-text text-custom-purple-text p-[10px] opacity-0 group-hover:opacity-100 transition-all m-auto">Login via discord</Button>
        </div>
    }
}