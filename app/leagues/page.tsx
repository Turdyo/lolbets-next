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
                            end_at: {
                                not: null
                            }
                        }
                    }
                }
            }
        }
    })

    return <div className="flex m-20 gap-6 flex-wrap">
        {leagues.map((league, index) => <ClickableSection key={index} href="/" className={`p-0 py-1 px-6 flex items-center w-max h-24`}>
            <Image alt="icon" src={league.image_url as string} width={50} height={50} />
            <div className="pl-6 flex flex-col">
                <span className="font-bold text-2xl">{league.name}</span>
                <span className="whitespace-nowrap">{league._count.match} matchs à venir</span>
            </div>
        </ClickableSection>

        )}
    </div>
}