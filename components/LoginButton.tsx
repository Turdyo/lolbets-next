"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./ui/Button"
import Image from "next/image"
import logo from '@/public/lolbets-logo.png'

interface LoginButtonProps {
    user : {
        name: string | null
        image: string | null
        points: number
    } | null
}

export function LoginButton({
    user
}: LoginButtonProps) {
    if (user) {
        return <div className="p-10 self-center flex flex-col items-center">
            <div className="flex gap-4 mb-6 items-center">
                <Image src={user.image!} width={40} height={40} className="rounded-full" alt={user.name!} />
                <div className="flex flex-col" >
                    <span className="font-bold text-custom-white-100">{user.name}</span>
                    <span className="flex gap-2">
                        <span className="font-bold text-custom-yellow-100">{user.points}</span>
                        <Image src={logo} alt="Logo" width={24} />
                    </span>
                </div>
            </div>
            <Button onClick={() => signOut()} className="border-custom-purple-text text-custom-purple-text">Sign out</Button>
        </div>

    } else {
        return <div className="p-10 self-center">
            <Button onClick={() => signIn("discord")} className="border-custom-purple-text text-custom-purple-text">Login via discord</Button>
        </div>
    }

}