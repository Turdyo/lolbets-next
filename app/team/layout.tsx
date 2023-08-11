import { TeamSearch } from "@/components/TeamSearch";
import { db } from "@/prisma";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
    const teams = await db.team.findMany({
        select: {
            acronym: true,
            name: true,
            image_url: true
        },
        orderBy: {
            name: "asc"
        }
    })

    return <div className="p-14 flex flex-col justify-evenly h-full">
        <TeamSearch teams={teams} className="h-min w-[60%] self-center" />
        <div className="basis-full mt-10 overflow-hidden">
            {children}
        </div>
    </div>

}