"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./ui/Button"
import Image from "next/image"

export function LoginButton() {

    const session = useSession()

    if (session.status === "authenticated") {
        return <div className="p-10 self-center flex flex-col items-center">
            <div className="flex gap-4 mb-6 items-center">
                <Image src={session.data.user?.image!} width={40} height={40} className="rounded-full" alt={session.data.user?.name!} />
                <span className="font-bold text-custom-white-100">{session.data.user?.name}</span>

            </div>
            <Button onClick={() => signOut()} className="border-custom-purple-text text-custom-purple-text">Sign out</Button>
        </div>

    } else {
        return <div className="p-10 self-center">
            <Button onClick={() => signIn("discord")} className="border-custom-purple-text text-custom-purple-text">Login via discord</Button>
        </div>
    }

}