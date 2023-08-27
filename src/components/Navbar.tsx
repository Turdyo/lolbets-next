"use client";
import { Trophy, User2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavbarElement } from "./NavbarElement";

export function Navbar() {
    const path = usePathname()
    return <div className='flex flex-col gap-4 m-2 mt-10  justify-center'>
        <NavbarElement href="/leagues" icon={<Trophy color="#a3a3a3" />} selected={path.includes("leagues")}>
            Leagues
        </NavbarElement>
        <NavbarElement href="/team" icon={<User2 color="#a3a3a3" />} selected={path.includes("team")}>
            Teams
        </NavbarElement>
    </div>
}

