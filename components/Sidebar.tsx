"use client";
import { Award, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";

export function Sidebar() {
    const path = usePathname()
    return <div className='p-10 flex flex-col gap-2'>
        <SideBarElement href="/leagues" icon={<Trophy color="#a3a3a3" />} selected={path.includes("leagues")} >
            Leagues
        </SideBarElement>
        <SideBarElement href="/leaderboard" icon={<Award color="#a3a3a3" />} selected={path.includes("leaderboard")} >
            Leaderboard
        </SideBarElement>
    </div>
}


interface SideBarElementProps {
    icon: ReactNode;
    href: string;
    selected?: boolean;
}

function SideBarElement({
    href,
    icon,
    selected = false,
    children
}: PropsWithChildren<SideBarElementProps>) {
    return <Link
        href={href}
        className={`flex items-center gap-4 border border-gray-600 border-opacity-0 hover:border-opacity-100 transition-all rounded-lg p-4 ${selected ? "border-opacity-100" : ""} `}
    >
        {icon}
        <span className={`font-semibold text-[#a3a3a3] text-sm ${selected ? "text-[#e5e7eb]" : ""}`}>{children}</span>
    </Link>
}