import { ClickableSection } from "@/components/ui/ClickableSection"
import { db } from "@/prisma"
import Image from "next/image"

export default async function Leagues() {
    const leagues = await db.league.findMany({
        include: {
            match: {
                where: {
                    status: "not_started"
                },
                include: {
                    _count: true
                },
            },
            _count: {
                select: {
                    match: {
                        where: {
                            status: 'not_started'
                        }
                    }
                }
            }
        }
    })

    return <div className="flex m-20 gap-6 flex-wrap justify-center">
        {leagues.map((league, index) => <>
            <ClickableSection key={index} href={`/leagues/${league.name.toLowerCase()}`} className={`p-0 py-1 px-6 flex items-center w-80 h-36`}>
                <Image alt="icon" src={league.image_url as string} width={100} height={100} />
                <div className="pl-6 flex flex-col">
                    <span className="font-bold text-2xl text-custom-yellow-100">{league.name}</span>
                    <span className="whitespace-nowrap">{league._count.match} matchs à venir</span>
                </div>
            </ClickableSection>
        </>

        )}
    </div>
}