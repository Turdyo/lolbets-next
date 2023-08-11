"use client"

import { getNormalizedText } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ClickableSection } from "./ui/ClickableSection";
import { twMerge } from "tailwind-merge";
import { PropsWithClassName } from "@/lib/types/common";
import { useRouter } from "next/navigation";

interface Team {
    name: string;
    acronym: string;
    image_url: string;
}


interface TeamSearchProps {
    teams: Team[]
}

export function TeamSearch({ teams, className }: PropsWithClassName<TeamSearchProps>) {
    const [results, setResults] = useState<Team[]>([])
    const [searchInput, setSearchInput] = useState<string>("")
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        if (searchInput === "") {
            setResults(teams)
        } else {
            const normalizedInput = getNormalizedText(searchInput)
            setResults(teams.filter(team => getNormalizedText(team.name).includes(normalizedInput) || getNormalizedText(team.acronym).includes(normalizedInput)))
        }
    }, [searchInput, teams])

    return (
        <div className={twMerge("flex flex-col relative", className)}>
            <input
                placeholder="Search..."
                onChange={event => setSearchInput(event.target.value)}
                className={twMerge(
                    "p-3 rounded-lg bg-custom-blue-200 border border-gray-600 border-opacity-60 shadow-md focus:outline-none",
                    isFocused ? "rounded-b-none border-b-0 shadow-none" : ""
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={async () => {
                    await new Promise(r => setTimeout(r, 100));
                    setIsFocused(false)
                }}
                onKeyDown={event => {
                    if (event.code === "Enter") {
                        router.push(`/team/${searchInput}`)
                    }
                }}
            />
            {isFocused && <div className="absolute z-10 top-[49px] flex flex-col w-full border border-gray-600 border-t-0 border-opacity-60 shadow-md rounded-b-lg max-h-80 overflow-auto">
                {results.map((team, index) => <ClickableSection
                    key={index} href={`/team/${team.name}`}
                    className="p-[4px] bg-custom-blue-200 border-none rounded-none block hover:bg-custom-blue-100 hover:text-custom-white-100 transition-none"
                >
                    {team.name.split("").map((char, index) => {
                        if (searchInput !== "" && getNormalizedText(searchInput).includes(getNormalizedText(char))) {
                            return <span key={index} className="text-custom-white-100 font-semibold">{char}</span>
                        } else {
                            return <span key={index}>{char}</span>
                        }
                    })}
                </ClickableSection>)}
            </div>}
        </div>
    )
}