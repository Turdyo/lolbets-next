"use client";
import { Award, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavbarElement } from "./NavbarElement";

export function Navbar() {
    const path = usePathname()
    return <div className='p-10 flex flex-col gap-2'>
        <NavbarElement href="/leagues" icon={<Trophy color="#a3a3a3" />} selected={path.includes("leagues")} >
            Leagues
        </NavbarElement>
        <NavbarElement href="/leaderboard" icon={<Award color="#a3a3a3" />} selected={path.includes("leaderboard")} >
            Leaderboard
        </NavbarElement>
    </div>
}

