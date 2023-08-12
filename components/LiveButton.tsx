"use client"
import { Button } from "@/components/ui/Button";
import { PropsWithClassName } from "@/lib/types/common";
import { twMerge } from "tailwind-merge";

interface LiveButtonProps {
    stream_url?: string
}

export function LiveButton({
    className,
    stream_url = "https://www.twitch.tv/otplol_"
}: PropsWithClassName<LiveButtonProps>) {
    return <div className={twMerge("relative min-w-max", className)}>
        <Button className="p-2 z-0 border-custom-purple-text text-custom-purple-text" onClick={() => {
            window.open(stream_url, "_blank")
        }}>Live</Button>
        <span className="absolute flex h-3 w-3 top-0 right-0 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-custom-purple-text opacity-75 z-10"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-custom-purple-text z-10"></span>
        </span>
    </div>
}